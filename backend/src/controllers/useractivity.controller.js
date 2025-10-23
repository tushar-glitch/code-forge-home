const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new user activity
const createUserActivity = async (req, res) => {
  const { activity_type, details, title, user_id } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const userActivity = await prisma.userActivity.create({
      data: {
        activity_type,
        details,
        title,
        user_id,
      },
    });
    res.status(201).json(userActivity);
  } catch (error) {
    console.error('Error creating user activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all user activities
const getUserActivities = async (req, res) => {
  try {
    const userActivities = await prisma.userActivity.findMany();
    res.status(200).json(userActivities);
  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single user activity by ID
const getUserActivityById = async (req, res) => {
  const { id } = req.params;
  try {
    const userActivity = await prisma.userActivity.findUnique({
      where: { id },
    });
    if (!userActivity) {
      return res.status(404).json({ message: 'User activity not found' });
    }
    res.status(200).json(userActivity);
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a user activity
const updateUserActivity = async (req, res) => {
  const { id } = req.params;
  const { activity_type, details, title, user_id } = req.body;
  try {
    const userActivity = await prisma.userActivity.update({
      where: { id },
      data: {
        activity_type,
        details,
        title,
        user_id,
      },
    });
    res.status(200).json(userActivity);
  } catch (error) {
    console.error('Error updating user activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a user activity
const deleteUserActivity = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.userActivity.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting user activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createUserActivity,
  getUserActivities,
  getUserActivityById,
  updateUserActivity,
  deleteUserActivity,
};