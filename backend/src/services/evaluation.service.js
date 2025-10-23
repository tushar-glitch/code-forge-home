
const { exec } = require('child_process');
const fs = require('fs/promises');
const path = require('path');
const util = require('util');

const execPromise = util.promisify(exec);

const runPlaywrightTests = async (submissionFiles, testFiles) => {
  const tempDir = path.join(__dirname, '..', '..', 'temp', `test-run-${Date.now()}`);

  try {
    // 1. Create temp directory
    await fs.mkdir(tempDir, { recursive: true });

    // 2. Write submission and test files
    for (const [filePath, content] of Object.entries(submissionFiles)) {
      const fullPath = path.join(tempDir, filePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content);
    }
    for (const [filePath, content] of Object.entries(testFiles)) {
      const fullPath = path.join(tempDir, filePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content);
    }

    // 3. Install dependencies
    await execPromise('npm install', { cwd: tempDir });

    // 4. Run Playwright tests
    const { stdout, stderr } = await execPromise('npx playwright test', { cwd: tempDir });

    // 5. Capture results
    // TODO: Parse the output and return a structured result

    return { success: true, stdout, stderr };

  } catch (error) {
    console.error('Error running Playwright tests:', error);
    return { success: false, error };
  } finally {
    // 6. Cleanup
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  }
};

module.exports = {
  runPlaywrightTests,
};
