const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create new feedback
const createFeedback = async (req, res) => {
  const { assignment_id, notes, reviewer, score } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const feedback = await prisma.feedback.create({
      data: {
        assignment_id,
        notes,
        reviewer,
        score,
      },
    });
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all feedback
const getFeedback = async (req, res) => {
  try {
    const feedback = await prisma.feedback.findMany();
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single feedback by ID
const getFeedbackById = async (req, res) => {
  const { id } = req.params;
  try {
    const feedback = await prisma.feedback.findUnique({
      where: { id: parseInt(id) },
    });
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update feedback
const updateFeedback = async (req, res) => {
  const { id } = req.params;
  const { assignment_id, notes, reviewer, score } = req.body;
  try {
    const feedback = await prisma.feedback.update({
      where: { id: parseInt(id) },
      data: {
        assignment_id,
        notes,
        reviewer,
        score,
      },
    });
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.feedback.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createFeedback,
  getFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
};