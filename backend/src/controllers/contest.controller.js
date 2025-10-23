const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new contest
const createContest = async (req, res) => {
  const { description, end_date, prize, project_id, skills, sponsor_logo, sponsor_name, start_date, status, title } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const contest = await prisma.contest.create({
      data: {
        description,
        end_date: new Date(end_date),
        prize,
        project_id,
        skills,
        sponsor_logo,
        sponsor_name,
        start_date: new Date(start_date),
        status,
        title,
      },
    });
    res.status(201).json(contest);
  } catch (error) {
    console.error('Error creating contest:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all contests
const getContests = async (req, res) => {
  try {
    const contests = await prisma.contest.findMany();
    res.status(200).json(contests);
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single contest by ID
const getContestById = async (req, res) => {
  const { id } = req.params;
  try {
    const contest = await prisma.contest.findUnique({
      where: { id },
    });
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    res.status(200).json(contest);
  } catch (error) {
    console.error('Error fetching contest:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a contest
const updateContest = async (req, res) => {
  const { id } = req.params;
  const { description, end_date, prize, project_id, skills, sponsor_logo, sponsor_name, start_date, status, title } = req.body;
  try {
    const contest = await prisma.contest.update({
      where: { id },
      data: {
        description,
        end_date: new Date(end_date),
        prize,
        project_id,
        skills,
        sponsor_logo,
        sponsor_name,
        start_date: new Date(start_date),
        status,
        title,
      },
    });
    res.status(200).json(contest);
  } catch (error) {
    console.error('Error updating contest:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a contest
const deleteContest = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.contest.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting contest:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createContest,
  getContests,
  getContestById,
  updateContest,
  deleteContest,
};