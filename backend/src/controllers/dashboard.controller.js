const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getTestSummary = async (req, res) => {
  const { testId } = req.params;

  try {
    const parsedTestId = parseInt(testId);
    if (isNaN(parsedTestId)) {
      return res.status(400).json({ message: 'Invalid Test ID' });
    }

    // Total invited students (TestAssignments)
    const totalInvited = await prisma.testAssignment.count({
      where: { test_id: parsedTestId },
    });

    // Total completed students (TestAssignments with status 'completed')
    const totalCompleted = await prisma.testAssignment.count({
      where: { test_id: parsedTestId, status: 'completed' },
    });

    // Average score (requires TestResult.score to be populated)
    const averageScoreResult = await prisma.testResult.aggregate({
      _avg: {
        score: true,
      },
      where: {
        TestAssignment: {
          test_id: parsedTestId,
        },
        score: {
          not: null, // Only consider results with a score
        },
      },
    });

    const averageScore = averageScoreResult._avg.score || 0;

    res.status(200).json({
      totalInvited,
      totalCompleted,
      averageScore: parseFloat(averageScore.toFixed(2)),
    });
  } catch (error) {
    console.error('Error fetching test summary:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getTestAssignmentsWithResults = async (req, res) => {
  const { testId } = req.params;

  try {
    const parsedTestId = parseInt(testId);
    if (isNaN(parsedTestId)) {
      return res.status(400).json({ message: 'Invalid Test ID' });
    }

    const assignments = await prisma.testAssignment.findMany({
      where: { test_id: parsedTestId },
      include: {
        Candidate: true, // Include candidate details
        Submission: {
          include: {
            TestResult: {
              orderBy: { created_at: 'desc' }, // Get the latest result for each submission
              take: 1,
            },
          },
        },
      },
      orderBy: { created_at: 'asc' },
    });

    // Flatten the structure to make it easier for the frontend
    const formattedAssignments = assignments.map(assignment => {
      const latestSubmission = assignment.Submission && assignment.Submission.length > 0 
                               ? assignment.Submission[0] : null;
      const latestTestResult = latestSubmission && latestSubmission.TestResult && latestSubmission.TestResult.length > 0
                               ? latestSubmission.TestResult[0] : null;

      return {
        id: assignment.id,
        candidate: assignment.Candidate ? { 
          id: assignment.Candidate.id,
          email: assignment.Candidate.email,
          first_name: assignment.Candidate.first_name,
          last_name: assignment.Candidate.last_name,
        } : null,
        status: assignment.status,
        started_at: assignment.started_at,
        completed_at: assignment.completed_at,
        submission_id: latestSubmission ? latestSubmission.id : null,
        test_result: latestTestResult ? {
          id: latestTestResult.id,
          status: latestTestResult.status,
          score: latestTestResult.score,
          evaluationStatus: latestTestResult.evaluationStatus,
          created_at: latestTestResult.created_at,
        } : null,
      };
    });

    res.status(200).json(formattedAssignments);
  } catch (error) {
    console.error('Error fetching test assignments with results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    // Placeholder for dashboard stats
    const totalTests = await prisma.test.count();
    const totalCandidates = await prisma.candidate.count();
    const totalSubmissions = await prisma.submission.count();

    res.status(200).json({
      totalTests,
      totalCandidates,
      totalSubmissions,
      // Add more stats as needed
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getWeeklySubmissions = async (req, res) => {
  try {
    // Placeholder for weekly submissions data
    // This would typically involve grouping submissions by week
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklySubmissions = await prisma.submission.count({
      where: {
        created_at: {
          gte: sevenDaysAgo,
        },
      },
    });

    res.status(200).json({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Example labels
      data: [10, 12, 8, 15, 20, 5, weeklySubmissions], // Example data, last one is actual count
    });
  } catch (error) {
    console.error('Error fetching weekly submissions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPassFailRatio = async (req, res) => {
  try {
    // Placeholder for pass/fail ratio
    const totalResults = await prisma.testResult.count();
    const passedResults = await prisma.testResult.count({
      where: { status: 'passed' },
    });

    const passRatio = totalResults > 0 ? (passedResults / totalResults) * 100 : 0;
    const failRatio = totalResults > 0 ? ((totalResults - passedResults) / totalResults) * 100 : 0;

    res.status(200).json({
      pass: parseFloat(passRatio.toFixed(2)),
      fail: parseFloat(failRatio.toFixed(2)),
    });
  } catch (error) {
    console.error('Error fetching pass/fail ratio:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getActivityFeed = async (req, res) => {
  try {
    // Placeholder for activity feed
    const activities = await prisma.userActivity.findMany({
      orderBy: { created_at: 'desc' },
      take: 10, // Get latest 10 activities
    });

    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getTestSummary,
  getTestAssignmentsWithResults,
  getDashboardStats,
  getWeeklySubmissions,
  getPassFailRatio,
  getActivityFeed,
};