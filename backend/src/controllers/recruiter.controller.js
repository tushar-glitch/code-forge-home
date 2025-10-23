const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new recruiter
const createRecruiter = async (req, res) => {
  const { lead_id } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const recruiter = await prisma.recruiter.create({
      data: {
        lead_id,
      },
    });
    res.status(201).json(recruiter);
  } catch (error) {
    if (error.code === 'P2002') { // Unique constraint failed for lead_id
      return res.status(409).json({ message: 'Recruiter with this lead ID already exists' });
    }
    console.error('Error creating recruiter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all recruiters
const getRecruiters = async (req, res) => {
  try {
    const recruiters = await prisma.recruiter.findMany();
    res.status(200).json(recruiters);
  } catch (error) {
    console.error('Error fetching recruiters:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single recruiter by ID
const getRecruiterById = async (req, res) => {
  const { id } = req.params;
  try {
    const recruiter = await prisma.recruiter.findUnique({
      where: { id: parseInt(id) },
    });
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }
    res.status(200).json(recruiter);
  } catch (error) {
    console.error('Error fetching recruiter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a recruiter
const updateRecruiter = async (req, res) => {
  const { id } = req.params;
  const { lead_id } = req.body;
  try {
    const recruiter = await prisma.recruiter.update({
      where: { id: parseInt(id) },
      data: {
        lead_id,
      },
    });
    res.status(200).json(recruiter);
  } catch (error) {
    console.error('Error updating recruiter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a recruiter
const deleteRecruiter = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.recruiter.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting recruiter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createRecruiter,
  getRecruiters,
  getRecruiterById,
  updateRecruiter,
  deleteRecruiter,
};