const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createRepoAndRunTests = async (req, res) => {
  const { assignment_id, submission_id, project_files, test_id, access_link } = req.body;

  try {
    let assignment;

    // Candidate flow
    if (access_link) {
      console.log("🔹 Candidate flow using access_link:", access_link);
      assignment = await prisma.testAssignment.findFirst({
        where: { access_link },
        include: { Test: true },
      });

      if (!assignment) {
        console.log("❌ Invalid access link");
        return res.status(404).json({ message: "Invalid or expired access link" });
      }
    }
    // Recruiter flow
    else if (assignment_id) {
      console.log("🔹 Recruiter flow using assignment_id:", assignment_id);
      assignment = await prisma.testAssignment.findUnique({
        where: { id: assignment_id },
        include: { Test: true },
      });

      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
    }
    // Missing both
    else {
      console.log("❌ Missing both access_link and assignment_id");
      return res.status(400).json({ message: "Missing both access_link and assignment_id" });
    }

    // --- Simulated test execution ---
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

    await prisma.testResult.create({
      data: {
        assignment_id: assignment.id,
        submission_id,
        status: testStatus,
        test_output: simulatedTestResults,
        logs: JSON.stringify({ message: "Simulated test logs" }),
        screenshot_urls: [],
      },
    });

    res.status(200).json({
      message: "Tests initiated successfully (simulated)",
      testStatus,
      testResults: simulatedTestResults,
    });
  } catch (error) {
    console.error("❌ Error in createRepoAndRunTests:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  createRepoAndRunTests,
};