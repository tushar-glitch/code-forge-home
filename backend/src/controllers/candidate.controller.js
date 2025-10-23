const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new candidate
const createCandidate = async (req, res) => {
  console.log('adf')
  const { email, first_name, last_name } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    // Check if candidate with this email and invited_by already exists
    let candidate = await prisma.candidate.findFirst({
      where: {
        email: email,
        invited_by: userId,
      },
    });

    if (candidate) {
      // If candidate already exists for this inviter, return the existing one
      return res.status(200).json(candidate);
    }

    // If not, create a new candidate
    candidate = await prisma.candidate.create({
      data: {
        email,
        first_name,
        last_name,
        invited_by: userId, // Use the authenticated user's ID as the inviter
      },
    });
    res.status(201).json(candidate);
  } catch (error) {
    // P2002 (Unique constraint failed) is no longer relevant for email as it's not unique
    console.error('Error creating candidate:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all candidates
const getCandidates = async (req, res) => {
  const { email, invited_by } = req.query;
  const where = {};

  if (email) {
    where.email = email;
  }
  if (invited_by) {
    where.invited_by = invited_by;
  }

  try {
    const candidates = await prisma.candidate.findMany({
      where,
    });
    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single candidate by ID
const getCandidateById = async (req, res) => {
  const { id } = req.params;
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: parseInt(id) },
    });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a candidate
const updateCandidate = async (req, res) => {
  const { id } = req.params;
  const { email, first_name, last_name, invited_by } = req.body;
  try {
    const candidate = await prisma.candidate.update({
      where: { id: parseInt(id) },
      data: {
        email,
        first_name,
        last_name,
        invited_by,
      },
    });
    res.status(200).json(candidate);
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a candidate
const deleteCandidate = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.candidate.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
};