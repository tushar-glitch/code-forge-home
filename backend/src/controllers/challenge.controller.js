const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new challenge
const createChallenge = async (req, res) => {
  const { description, difficulty, is_active, project_id, tags, title } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const challenge = await prisma.challenge.create({
      data: {
        description,
        difficulty,
        is_active: is_active !== undefined ? is_active : true,
        project_id,
        tags,
        title,
      },
    });
    res.status(201).json(challenge);
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all challenges


const getChallenges = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const challenges = await prisma.challenge.findMany({
      skip: parseInt(offset),
      take: parseInt(limit),
    });

    const totalChallenges = await prisma.challenge.count();

    res.status(200).json({
      challenges,
      totalPages: Math.ceil(totalChallenges / limit),
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single challenge by ID
const getChallengeById = async (req, res) => {
  const { id } = req.params;
  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id },
    });
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.status(200).json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a challenge
const updateChallenge = async (req, res) => {
  const { id } = req.params;
  const { description, difficulty, is_active, project_id, tags, title } = req.body;
  try {
    const challenge = await prisma.challenge.update({
      where: { id },
      data: {
        description,
        difficulty,
        is_active,
        project_id,
        tags,
        title,
      },
    });
    res.status(200).json(challenge);
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a challenge
const deleteChallenge = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.challenge.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
};