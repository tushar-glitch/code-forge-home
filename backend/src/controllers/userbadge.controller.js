const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new user badge
const createUserBadge = async (req, res) => {
  const { badge_id, user_id } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const userBadge = await prisma.userBadge.create({
      data: {
        badge_id,
        user_id,
      },
    });
    res.status(201).json(userBadge);
  } catch (error) {
    console.error('Error creating user badge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all user badges
const getUserBadges = async (req, res) => {
  try {
    const userBadges = await prisma.userBadge.findMany();
    res.status(200).json(userBadges);
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single user badge by ID
const getUserBadgeById = async (req, res) => {
  const { id } = req.params;
  try {
    const userBadge = await prisma.userBadge.findUnique({
      where: { id },
    });
    if (!userBadge) {
      return res.status(404).json({ message: 'User badge not found' });
    }
    res.status(200).json(userBadge);
  } catch (error) {
    console.error('Error fetching user badge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a user badge
const updateUserBadge = async (req, res) => {
  const { id } = req.params;
  const { badge_id, user_id } = req.body;
  try {
    const userBadge = await prisma.userBadge.update({
      where: { id },
      data: {
        badge_id,
        user_id,
      },
    });
    res.status(200).json(userBadge);
  } catch (error) {
    console.error('Error updating user badge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a user badge
const deleteUserBadge = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.userBadge.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting user badge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createUserBadge,
  getUserBadges,
  getUserBadgeById,
  updateUserBadge,
  deleteUserBadge,
};