const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new contest participant
const createContestParticipant = async (req, res) => {
  const { contest_id, rank, score, submission_content, user_id } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const contestParticipant = await prisma.contestParticipant.create({
      data: {
        contest_id,
        rank,
        score,
        submission_content,
        user_id,
      },
    });
    res.status(201).json(contestParticipant);
  } catch (error) {
    console.error('Error creating contest participant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all contest participants
const getContestParticipants = async (req, res) => {
  try {
    const contestParticipants = await prisma.contestParticipant.findMany();
    res.status(200).json(contestParticipants);
  } catch (error) {
    console.error('Error fetching contest participants:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single contest participant by ID
const getContestParticipantById = async (req, res) => {
  const { id } = req.params;
  try {
    const contestParticipant = await prisma.contestParticipant.findUnique({
      where: { id },
    });
    if (!contestParticipant) {
      return res.status(404).json({ message: 'Contest participant not found' });
    }
    res.status(200).json(contestParticipant);
  } catch (error) {
    console.error('Error fetching contest participant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a contest participant
const updateContestParticipant = async (req, res) => {
  const { id } = req.params;
  const { contest_id, rank, score, submission_content, user_id } = req.body;
  try {
    const contestParticipant = await prisma.contestParticipant.update({
      where: { id },
      data: {
        contest_id,
        rank,
        score,
        submission_content,
        user_id,
      },
    });
    res.status(200).json(contestParticipant);
  } catch (error) {
    console.error('Error updating contest participant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a contest participant
const deleteContestParticipant = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.contestParticipant.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting contest participant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createContestParticipant,
  getContestParticipants,
  getContestParticipantById,
  updateContestParticipant,
  deleteContestParticipant,
};