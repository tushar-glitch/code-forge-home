const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new test result
const createTestResult = async (req, res) => {
  const { assignment_id, logs, screenshot_urls, status, submission_id, test_output } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const testResult = await prisma.testResult.create({
      data: {
        assignment_id,
        logs,
        screenshot_urls,
        status,
        submission_id,
        test_output,
      },
    });
    res.status(201).json(testResult);
  } catch (error) {
    console.error('Error creating test result:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all test results
const getTestResults = async (req, res) => {
  const { submissionId } = req.query;
  const where = {};
  if (submissionId) {
    const parsedSubmissionId = parseInt(submissionId);
    if (isNaN(parsedSubmissionId)) {
      return res.status(400).json({ message: 'Invalid submissionId' });
    }
    where.submission_id = parsedSubmissionId;
  }
  try {
    const testResults = await prisma.testResult.findMany({
      where,
    });
    res.status(200).json(testResults);
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single test result by ID
const getTestResultById = async (req, res) => {
  const { id } = req.params;
  try {
    const testResult = await prisma.testResult.findUnique({
      where: { id },
    });
    if (!testResult) {
      return res.status(404).json({ message: 'Test result not found' });
    }
    res.status(200).json(testResult);
  } catch (error) {
    console.error('Error fetching test result:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a test result
const updateTestResult = async (req, res) => {
  const { id } = req.params;
  const { assignment_id, logs, screenshot_urls, status, submission_id, test_output } = req.body;
  try {
    const testResult = await prisma.testResult.update({
      where: { id },
      data: {
        assignment_id,
        logs,
        screenshot_urls,
        status,
        submission_id,
        test_output,
      },
    });
    res.status(200).json(testResult);
  } catch (error) {
    console.error('Error updating test result:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a test result
const deleteTestResult = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.testResult.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting test result:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createTestResult,
  getTestResults,
  getTestResultById,
  updateTestResult,
  deleteTestResult,
};