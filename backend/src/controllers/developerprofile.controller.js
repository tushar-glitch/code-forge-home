const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new developer profile
const createDeveloperProfile = async (req, res) => {
  const { avatar_url, bio, full_name, github_url, join_date, level, linkedin_url, next_level_xp, username, xp_points } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const developerProfile = await prisma.developerProfile.create({
      data: {
        avatar_url,
        bio,
        full_name,
        github_url,
        join_date: join_date ? new Date(join_date) : undefined,
        level,
        linkedin_url,
        next_level_xp,
        username,
        xp_points,
        userId, // Link to the authenticated user
      },
    });
    res.status(201).json(developerProfile);
  } catch (error) {
    if (error.code === 'P2002') { // Unique constraint failed for username or userId
      return res.status(409).json({ message: 'Developer profile with this username or user ID already exists' });
    }
    console.error('Error creating developer profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all developer profiles
const getDeveloperProfiles = async (req, res) => {
  try {
    const developerProfiles = await prisma.developerProfile.findMany();
    res.status(200).json(developerProfiles);
  } catch (error) {
    console.error('Error fetching developer profiles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single developer profile by ID
const getDeveloperProfileById = async (req, res) => {
  const { id } = req.params;
  try {
    const developerProfile = await prisma.developerProfile.findUnique({
      where: { id },
    });
    if (!developerProfile) {
      return res.status(404).json({ message: 'Developer profile not found' });
    }
    res.status(200).json(developerProfile);
  } catch (error) {
    console.error('Error fetching developer profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a developer profile
const updateDeveloperProfile = async (req, res) => {
  const { id } = req.params;
  const { avatar_url, bio, full_name, github_url, join_date, level, linkedin_url, next_level_xp, username, xp_points } = req.body;
  try {
    const developerProfile = await prisma.developerProfile.update({
      where: { id },
      data: {
        avatar_url,
        bio,
        full_name,
        github_url,
        join_date: join_date ? new Date(join_date) : undefined,
        level,
        linkedin_url,
        next_level_xp,
        username,
        xp_points,
      },
    });
    res.status(200).json(developerProfile);
  } catch (error) {
    console.error('Error updating developer profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a developer profile
const deleteDeveloperProfile = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.developerProfile.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting developer profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createDeveloperProfile,
  getDeveloperProfiles,
  getDeveloperProfileById,
  updateDeveloperProfile,
  deleteDeveloperProfile,
};