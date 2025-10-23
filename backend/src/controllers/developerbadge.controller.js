const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new developer badge
const createDeveloperBadge = async (req, res) => {
  const { description, icon, name, rarity } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const developerBadge = await prisma.developerBadge.create({
      data: {
        description,
        icon,
        name,
        rarity,
      },
    });
    res.status(201).json(developerBadge);
  } catch (error) {
    console.error('Error creating developer badge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all developer badges
const getDeveloperBadges = async (req, res) => {
  try {
    const developerBadges = await prisma.developerBadge.findMany();
    res.status(200).json(developerBadges);
  } catch (error) {
    console.error('Error fetching developer badges:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single developer badge by ID
const getDeveloperBadgeById = async (req, res) => {
  const { id } = req.params;
  try {
    const developerBadge = await prisma.developerBadge.findUnique({
      where: { id },
    });
    if (!developerBadge) {
      return res.status(404).json({ message: 'Developer badge not found' });
    }
    res.status(200).json(developerBadge);
  } catch (error) {
    console.error('Error fetching developer badge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a developer badge
const updateDeveloperBadge = async (req, res) => {
  const { id } = req.params;
  const { description, icon, name, rarity } = req.body;
  try {
    const developerBadge = await prisma.developerBadge.update({
      where: { id },
      data: {
        description,
        icon,
        name,
        rarity,
      },
    });
    res.status(200).json(developerBadge);
  } catch (error) {
    console.error('Error updating developer badge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a developer badge
const deleteDeveloperBadge = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.developerBadge.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting developer badge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createDeveloperBadge,
  getDeveloperBadges,
  getDeveloperBadgeById,
  updateDeveloperBadge,
  deleteDeveloperBadge,
};