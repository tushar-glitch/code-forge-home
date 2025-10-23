const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new profile
const createProfile = async (req, res) => {
  const { company_id, first_name, last_name, role } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const profile = await prisma.profile.create({
      data: {
        company_id,
        first_name,
        last_name,
        role,
        userId, // Link to the authenticated user
      },
    });
    res.status(201).json(profile);
  } catch (error) {
    if (error.code === 'P2002') { // Unique constraint failed for userId
      return res.status(409).json({ message: 'Profile for this user already exists' });
    }
    console.error('Error creating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all profiles
const getProfiles = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany();
    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single profile by ID
const getProfileById = async (req, res) => {
  const { id } = req.params;
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: parseInt(id) },
    });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a profile
const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { company_id, first_name, last_name, role } = req.body;
  try {
    const profile = await prisma.profile.update({
      where: { id: parseInt(id) },
      data: {
        company_id,
        first_name,
        last_name,
        role,
      },
    });
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a profile
const deleteProfile = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.profile.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
};