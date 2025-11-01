const { Worker } = require('bullmq');
const fs = require('fs/promises');
const path = require('path');
const Docker = require('dockerode');
const axios = require('axios');
const { connection } = require('./src/services/queue.service');

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

console.log('Worker started, waiting for jobs...');

const jobWorker = new Worker('exec-jobs', async job => {
  const { submissionId, files, testFiles, dependencies, projectId, resourceLimits } = job.data;
  const jobId = job.id;
  console.log(`Processing job ${jobId} for submission ${submissionId}`);
  console.log('Worker received:', {
    filesCount: Object.keys(files || {}).length,
    testFilesCount: Object.keys(testFiles || {}).length,
    hasDependencies: !!dependencies,
  });

  const workspace = path.join(__dirname, `temp/job-${jobId}`);
  let container = null;

  try {
    // 1. Prepare workspace
    await fs.mkdir(workspace, { recursive: true });
    
    // Write candidate's code files
    for (const [filePath, content] of Object.entries(files || {})) {
      const fullPath = path.join(workspace, filePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content);
    }
    
    // Write test files
    for (const [filePath, content] of Object.entries(testFiles || {})) {
      const fullPath = path.join(workspace, filePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content);
    }

    // Create package.json with dependencies
    const basePackageJson = {
      name: 'test-runner',
      version: '1.0.0',
      description: 'Test runner for code-forge',
      main: 'index.js',
      scripts: {
        test: 'jest --json --outputFile=test-results.json'
      },
      dependencies:{
          "@babel/runtime": "^7.23.0",
            '@testing-library/react': '^14.0.0',
        '@testing-library/jest-dom': '^6.0.0',
        '@babel/core': '^7.23.0',
        '@babel/preset-env': '^7.23.0',
        '@babel/preset-react': '^7.23.0',
        'babel-jest': '^29.0.0',
        'jest': '^29.0.0',
        'jest-environment-jsdom': '^29.0.0',
        'identity-obj-proxy': '^3.0.0'
      },
      devDependencies: {
      
      }
    };

    const candidatePackageJson = {
      name: 'test-submission',
      version: '1.0.0',
      scripts: {
        test: 'jest --json --outputFile=test-results.json'
      },
      dependencies: dependencies || {},
    };

    const mergedPackageJson = {
      ...basePackageJson,
      ...candidatePackageJson,
      dependencies: {
        ...(basePackageJson.dependencies || {}),
        ...(candidatePackageJson.dependencies || {}),
      },
      devDependencies: {
        ...(basePackageJson.devDependencies || {}),
        ...(candidatePackageJson.devDependencies || {}),
      },
    };
    
    await fs.writeFile(
      path.join(workspace, 'package.json'),
      JSON.stringify(mergedPackageJson, null, 2)
    );

    // FIXED: Use babel.config.js instead of .babelrc
    const babelConfig = {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    };
    await fs.writeFile(
      path.join(workspace, 'babel.config.js'),
      `module.exports = ${JSON.stringify(babelConfig, null, 2)};`
    );

    // Create jest.config.js
    const jestConfig = `
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(other-package-to-transform)/)',
  ],
};
`;
    await fs.writeFile(path.join(workspace, 'jest.config.js'), jestConfig);
    
    // Create jest.setup.js
    await fs.writeFile(
      path.join(workspace, 'jest.setup.js'),
      "require('@testing-library/jest-dom');\n"
    );

    // 2. Choose image
    const image = 'test-runner:latest'; // Using our pre-built image with deps

    // 3. Start container with strict options
    const mem = resourceLimits.memoryMb || 512;
    const cpus = resourceLimits.cpus || 0.5;
    const timeoutMs = resourceLimits.timeoutMs || 120000; // Increased to 120s for npm install

    const binds = [`${workspace}:/data:rw`];

    const command = dependencies && Object.keys(dependencies).length > 0
  ? `
    set -e
    cp -r /data/* /workspace/ 2>/dev/null || true
    cp -r /usr/src/app/node_modules /workspace/
    cp /usr/src/app/babel.config.js /workspace/ 2>/dev/null || true
    cd /workspace
    npm install --silent
    npm test
    cp test-results.json /data/ 2>/dev/null || true
  `.trim()
  : `
    set -e
    cp -r /data/* /workspace/ 2>/dev/null || true
    cp -r /usr/src/app/node_modules /workspace/
    cp /usr/src/app/babel.config.js /workspace/ 2>/dev/null || true
    cd /workspace
    npm test
    cp test-results.json /data/ 2>/dev/null || true
  `.trim();

    const createOptions = {
      Image: image,
      HostConfig: {
        Binds: binds,
        NetworkMode: 'bridge',
        Memory: mem * 1024 * 1024,
        NanoCpus: Math.floor(cpus * 1e9),
        PidsLimit: 128,
        ReadonlyRootfs: false, // Required for npm install
        CapDrop: ['ALL'],
      },
      Cmd: ['/bin/sh', '-c', command],
      WorkingDir: '/workspace',
      Tty: false,
      OpenStdin: false,
      User: 'node', // Using node user from alpine image
    };

    container = await docker.createContainer(createOptions);

    const logStream = await container.attach({ stream: true, stdout: true, stderr: true });
    let stdout = '';
    let stderr = '';
    logStream.on('data', (chunk) => {
      // Demultiplex Docker stream format
      const header = chunk[0];
      const data = chunk.slice(8).toString('utf8');
      if (header === 1) stdout += data;
      else if (header === 2) stderr += data;
      else stdout += data; // Fallback
    });

    await container.start();
    console.log(`Container started for job ${jobId}`);

    let timedOut = false;
    const killTimer = setTimeout(async () => {
      console.log(`Job ${jobId} timed out after ${timeoutMs}ms`);
      timedOut = true;
      try { 
        if (container) await container.stop(); 
      } catch (e) { 
        console.log('Error stopping container:', e.message);
      }
    }, timeoutMs);

    // Wait for container to finish - container.wait() returns a promise that resolves to an array
    const waitResult = await container.wait();
    clearTimeout(killTimer);
    
    // Handle the wait result properly
    const exitCode = waitResult?.StatusCode || waitResult?.[0]?.StatusCode || 0;
    console.log(`Container exited with code ${exitCode} for job ${jobId}`);

    // 4. Collect artifacts
    let testResults = null;
    const resultsPath = path.join(workspace, 'test-results.json');
    try {
      const resultsRaw = await fs.readFile(resultsPath, 'utf8');
      testResults = JSON.parse(resultsRaw);
      console.log(`Test results collected for job ${jobId}`);
    } catch (e) {
      console.log(`No test results file found for job ${jobId}:`, e.message);
    }

    // 5. Post results back to the main API
    const resultPayload = {
      submissionId,
      status: timedOut ? 'timeout' : (exitCode === 0 ? 'passed' : 'failed'),
      exitCode,
      stdout,
      stderr,
      testResults,
      durationMs: 0, // Placeholder
    };

    console.log(`Posting results for job ${jobId}:`, { 
      status: resultPayload.status, 
      exitCode,
      hasTestResults: !!testResults 
    });
    
    if (stdout) {
        console.log('STDOUT (len=%d):', stdout.length);
        console.log(stdout.substring(0, 3000));
      }
      if (stderr) {
        console.log('STDERR (len=%d):', stderr.length);
        console.log(stderr.substring(0, 3000));
      }

    try {
        const resp = await axios.post('http://localhost:3001/api/exec/internal/results', resultPayload, {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' }
        });
        console.log('Posted results, server responded:', resp.status);
      } catch (err) {
        if (err.response) {
          console.error('POST failed - response status:', err.response.status);
          console.error('POST failed - response headers:', err.response.headers);
          console.error('POST failed - response data:', JSON.stringify(err.response.data).substring(0, 2000));
        } else if (err.request) {
          console.error('POST failed - no response received:', err.message);
        } else {
          console.error('POST failed - setup error:', err.message);
        }
        throw err;
      }

    console.log(`Job ${jobId} completed with status: ${resultPayload.status}`);

    return resultPayload;

  } catch (error) {
    console.error(`Job ${jobId} failed with error:`, error.message);
    console.error('Full error:', error);
    
    // Try to post failure to API
    try {
      await axios.post('http://localhost:3001/api/exec/internal/results', {
        submissionId,
        status: 'error',
        stderr: error.message,
      });
    } catch (postError) {
      console.error('Failed to post error results:', postError.message);
    }
    
    throw error; // Re-throw to mark job as failed in BullMQ
  } finally {
    // 6. Cleanup container and workspace
    try {
      if (container) {
        await container.remove({ force: true });
        console.log(`Container removed for job ${jobId}`);
      }
    } catch (e) {
      console.log('Error removing container:', e.message);
    }
    
    try {
      await fs.rm(workspace, { recursive: true, force: true });
      console.log(`Workspace cleaned for job ${jobId}`);
    } catch (e) {
      console.log('Error cleaning workspace:', e.message);
    }
  }
}, { connection });

jobWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} ultimately failed:`, err);
});