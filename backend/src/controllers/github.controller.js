const { PrismaClient } = require('@prisma/client');
// const { Octokit } = require('@octokit/rest'); // Assuming Octokit is used for GitHub API interaction

const prisma = new PrismaClient();

const createRepoAndRunTests = async (req, res) => {
  const { assignment_id, submission_id, project_files, test_id } = req.body;
  const userId = req.userId; // Authenticated user

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    // 1. Fetch assignment details to get github_access_token and repo_url if available
    const assignment = await prisma.testAssignment.findUnique({
      where: { id: assignment_id },
      include: { Test: true },
    });

    if (!assignment || assignment.candidate_id !== parseInt(userId)) { // Assuming candidate_id is linked to userId
      return res.status(404).json({ message: 'Assignment not found or unauthorized' });
    }

    // For now, we'll simulate the GitHub interaction and test running.
    // In a real scenario, you would:
    // a. Use assignment.github_access_token to authenticate with GitHub (e.g., using Octokit)
    // b. Create a new repository or update an existing one with project_files
    // c. Trigger a CI/CD pipeline (e.g., GitHub Actions) to run tests on the submitted code
    // d. Update the submission with test results and status

    // Simulate test running
    const simulatedTestResults = {
      passed: Math.random() > 0.5,
      score: Math.floor(Math.random() * 100),
      feedback: "Simulated test feedback.",
    };

    const testStatus = simulatedTestResults.passed ? 'passed' : 'failed';

    await prisma.submission.update({
      where: { id: submission_id },
      data: {
        test_status: testStatus,
        test_results: simulatedTestResults,
      },
    });

    // Create a test result entry
    await prisma.testResult.create({
      data: {
        assignment_id,
        submission_id,
        status: testStatus,
        test_output: simulatedTestResults,
        logs: JSON.stringify({ message: "Simulated test logs" }),
        screenshot_urls: [],
      },
    });

    res.status(200).json({ message: 'Tests initiated successfully (simulated)', testStatus, testResults: simulatedTestResults });
  } catch (error) {
    console.error('Error creating repo and running tests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createRepoAndRunTests,
};