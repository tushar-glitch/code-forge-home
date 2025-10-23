const { PrismaClient } = require('@prisma/client');
const { runPlaywrightTests } = require('../services/evaluation.service');

const prisma = new PrismaClient();

const evaluateSubmission = async (submissionId) => {
  try {
    // 1. Fetch submission and related data
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        TestAssignment: {
          include: {
            Test: {
              include: {
                CodeProject: true,
              },
            },
          },
        },
      },
    });

    if (!submission) {
      throw new Error('Submission not found');
    }

    const test = submission.TestAssignment.Test;

    // 2. Get submission and test files
    const submissionFiles = submission.code_snapshot;
    const testFiles = test.test_files_json;

    if (!submissionFiles || !testFiles) {
      throw new Error('Submission or test files not found');
    }
    console.log(submissionFiles, testFiles)

    // 3. Run Playwright tests
    const results = await runPlaywrightTests(submissionFiles, testFiles);

    // 4. Save test results
    await prisma.testResult.create({
      data: {
        submission_id: submission.id,
        assignment_id: submission.assignment_id,
        status: results.success ? 'passed' : 'failed',
        test_output: results,
      },
    });

    return { success: true, message: 'Evaluation completed', results };

  } catch (error) {
    console.error('Error running evaluation:', error);
    return { success: false, message: 'Internal server error' };
  }
};

const runEvaluation = async (req, res) => {
  const { submissionId } = req.body;
  const result = await evaluateSubmission(submissionId);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
};

module.exports = {
  runEvaluation,
  evaluateSubmission,
};