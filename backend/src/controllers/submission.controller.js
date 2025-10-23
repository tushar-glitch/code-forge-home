const { PrismaClient } = require('@prisma/client');
const { evaluateSubmission } = require('./evaluation.controller');

const prisma = new PrismaClient();

// Create a new submission
const createSubmission = async (req, res) => {
  const { accessLink, code_snapshot } = req.body;

  try {
    // 1. Find the test assignment by access link
    const testAssignment = await prisma.testAssignment.findFirst({
      where: { access_link: accessLink },
    });

    if (!testAssignment) {
      return res.status(404).json({ message: 'Test assignment not found' });
    }

    // 2. Create a new submission
    const submission = await prisma.submission.create({
      data: {
        assignment_id: testAssignment.id,
        code_snapshot: code_snapshot,
        test_status: 'pending',
      },
    });

    // 3. Trigger the evaluation (asynchronously)
    evaluateSubmission(submission.id);

    res.status(201).json(submission);
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all submissions
const getSubmissions = async (req, res) => {
  const { testId } = req.query;
  const where = {};
  if (testId) {
    const parsedTestId = parseInt(testId);
    if (isNaN(parsedTestId)) {
      return res.status(400).json({ message: 'Invalid testId' });
    }
    where.TestAssignment = { test_id: parsedTestId };
  }

  try {
    const submissions = await prisma.submission.findMany({
      where,
      include: {
        TestAssignment: {
          include: {
            Candidate: true,
            Test: {
              include: {
                User: { select: { id: true, email: true } }, // Include recruiter user info
              },
            },
          },
        },
      },
    });
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single submission by ID
const getSubmissionById = async (req, res) => {
  const { id } = req.params;
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: parseInt(id) },
      include: {
        TestAssignment: {
          include: {
            Candidate: true,
            Test: {
              include: {
                User: { select: { id: true, email: true } }, // Include recruiter user info
              },
            },
          },
        },
      },
    });
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.status(200).json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a submission
const updateSubmission = async (req, res) => {
  const { id } = req.params;
  const { assignment_id, content, file_path, saved_at, test_results, test_status } = req.body;
  try {
    const submission = await prisma.submission.update({
      where: { id: parseInt(id) },
      data: {
        assignment_id,
        content,
        file_path,
        saved_at,
        test_results,
        test_status,
      },
    });
    res.status(200).json(submission);
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a submission
const deleteSubmission = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.submission.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
};