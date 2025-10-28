const { PrismaClient } = require('@prisma/client');
const { evaluateSubmission } = require('../controllers/evaluation.controller');

const prisma = new PrismaClient();

// Create a new test assignment
const createTestAssignment = async (req, res) => {
  const { access_link, candidate_id, completed_at, git_branch, github_access_token, github_repo_url, started_at, status, test_id } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const testAssignment = await prisma.testAssignment.create({
      data: {
        access_link,
        candidate_id,
        completed_at,
        git_branch,
        github_access_token,
        github_repo_url,
        started_at,
        status,
        test_id,
      },
    });
    res.status(201).json(testAssignment);
  } catch (error) {
    console.error('Error creating test assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all test assignments
const getTestAssignments = async (req, res) => {
  try {
    const testAssignments = await prisma.testAssignment.findMany();
    res.status(200).json(testAssignments);
  } catch (error) {
    console.error('Error fetching test assignments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single test assignment by ID
const getTestAssignmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const testAssignment = await prisma.testAssignment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!testAssignment) {
      return res.status(404).json({ message: 'Test assignment not found' });
    }
    res.status(200).json(testAssignment);
  } catch (error) {
    console.error('Error fetching test assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getTestAssignmentByAccessLink = async (req, res) => {
  const { accessLink } = req.params;
  try {
    const testAssignment = await prisma.testAssignment.findFirst({
      where: { access_link: accessLink },
      include: {
        Test: {
          select: {
            id: true,
            files_json: true,
            dependencies: true,
            test_files_json: true,
            problem_statement: true,
            primary_language: true,
            time_limit: true,
            test_title: true,
            instructions: true,
          },
        },
      },
    });
    if (!testAssignment) {
      return res.status(404).json({ message: 'Test assignment not found' });
    }
    res.status(200).json(testAssignment);
  } catch (error) {
    console.error('Error fetching test assignment by access link:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateTestAssignmentByAccessLink = async (req, res) => {
  const { accessLink } = req.params;
  const { status, started_at, completed_at, code_snapshot } = req.body;
  console.log('Received accessLink:', accessLink);
  try {
    const assignment = await prisma.testAssignment.findFirst({
      where: { access_link: accessLink },
    });
    console.log('Found assignment:', assignment);

    if (!assignment) {
      return res.status(404).json({ message: 'Test assignment not found' });
    }

    const updatedAssignment = await prisma.testAssignment.update({
      where: { id: assignment.id },
      data: {
        status,
        started_at,
        completed_at,
      },
    });

    if (code_snapshot) {
      await prisma.submission.create({
        data: {
          assignment_id: assignment.id,
          code_snapshot,
        },
      });
    }

    // Trigger evaluation asynchronously
    if (status === 'completed') {
      evaluateSubmission(assignment.id);
    }

    res.status(200).json(updatedAssignment);
  } catch (error) {
    console.error('Error updating test assignment by access link:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a test assignment
const updateTestAssignment = async (req, res) => {
  const { id } = req.params;
  const { access_link, candidate_id, completed_at, git_branch, github_access_token, github_repo_url, started_at, status, test_id } = req.body;
  try {
    const testAssignment = await prisma.testAssignment.update({
      where: { id: parseInt(id) },
      data: {
        access_link,
        candidate_id,
        completed_at,
        git_branch,
        github_access_token,
        github_repo_url,
        started_at,
        status,
        test_id,
      },
    });
    res.status(200).json(testAssignment);
  } catch (error) {
    console.error('Error updating test assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a test assignment
const deleteTestAssignment = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.testAssignment.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting test assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createTestAssignment,
  getTestAssignments,
  getTestAssignmentById,
  getTestAssignmentByAccessLink,
  updateTestAssignment,
  deleteTestAssignment,
  updateTestAssignmentByAccessLink,
};