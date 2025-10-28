const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { execQueue } = require('../services/queue.service');

// This endpoint is called by the frontend to run tests
const submitExecution = async (req, res) => {
  const { assignmentId, files, projectId } = req.body;
  console.log('Received assignmentId:', assignmentId);

  if (!assignmentId || !files || !projectId) {
    return res.status(400).json({ error: 'Missing required fields: assignmentId, files, projectId' });
  }

  try {
    // 1. Fetch the Test details to get test files and dependencies
    const test = await prisma.test.findUnique({
      where: { id: parseInt(projectId) },
      select: {
        test_files_json: true,
        dependencies: true,
      },
    });

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    console.log('Test fetched:', { 
      hasTestFiles: !!test.test_files_json, 
      hasDependencies: !!test.dependencies 
    });

    // 2. Create a new submission record
    const submission = await prisma.submission.create({
      data: {
        TestAssignment: {
          connect: { id: parseInt(assignmentId) }
        },
        content: JSON.stringify(files), // Save the code
        test_status: 'pending',
        saved_at: new Date(),
      },
    });

    // 3. Add the job to the queue with test files and dependencies
    const job = await execQueue.add('run-tests', {
      submissionId: submission.id,
      files, // Candidate's code
      testFiles: test.test_files_json || {}, // Test files from Test model
      dependencies: test.dependencies || {}, // Dependencies from Test model
      projectId,
      resourceLimits: { memoryMb: 512, timeoutMs: 120000, cpus: 0.5 },
    });

    console.log('Job queued:', job.id);

    // 4. Respond to the frontend immediately
    res.status(202).json({
      message: 'Submission received and queued for execution.',
      submissionId: submission.id,
      jobId: job.id,
    });
  } catch (error) {
    console.error('Error submitting execution:', error);
    res.status(500).json({ error: 'Failed to queue execution job.' });
  }
};

// This endpoint is polled by the frontend to get the status
const getExecutionStatus = async (req, res) => {
  const { submissionId } = req.params;

  try {
    const submission = await prisma.submission.findUnique({
      where: { id: parseInt(submissionId) },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.status(200).json({
      status: submission.status,
      test_status: submission.test_status,
      results: submission.test_results,
      stdout: submission.stdout,
      stderr: submission.stderr,
    });
  } catch (error) {
    console.error('Error getting execution status:', error);
    res.status(500).json({ error: 'Failed to get execution status.' });
  }
};

// This is an internal endpoint called by the worker to post results
const postExecutionResult = async (req, res) => {
  const { submissionId, status, exitCode, stdout, stderr, testResults, durationMs } = req.body;

  if (!submissionId) {
    return res.status(400).json({ error: 'Missing submissionId' });
  }

  try {
    await prisma.submission.update({
      where: { id: parseInt(submissionId) },
      data: {
        status: 'completed',
        test_status: status,
        exit_code: exitCode,
        stdout,
        stderr,
        test_results: testResults,
        duration: durationMs,
      },
    });
    res.status(200).json({ message: 'Result received' });
  } catch (error) {
    console.error('Error updating execution result:', error);
    res.status(500).json({ error: 'Failed to update execution result.' });
  }
};

module.exports = {
  submitExecution,
  getExecutionStatus,
  postExecutionResult,
};
