const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new user skill
const createUserSkill = async (req, res) => {
  const { level, skill, user_id } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const userSkill = await prisma.userSkill.create({
      data: {
        level,
        skill,
        user_id,
      },
    });
    res.status(201).json(userSkill);
  } catch (error) {
    console.error('Error creating user skill:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all user skills
const getUserSkills = async (req, res) => {
  try {
    const userSkills = await prisma.userSkill.findMany();
    res.status(200).json(userSkills);
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single user skill by ID
const getUserSkillById = async (req, res) => {
  const { id } = req.params;
  try {
    const userSkill = await prisma.userSkill.findUnique({
      where: { id },
    });
    if (!userSkill) {
      return res.status(404).json({ message: 'User skill not found' });
    }
    res.status(200).json(userSkill);
  } catch (error) {
    console.error('Error fetching user skill:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a user skill
const updateUserSkill = async (req, res) => {
  const { id } = req.params;
  const { level, skill, user_id } = req.body;
  try {
    const userSkill = await prisma.userSkill.update({
      where: { id },
      data: {
        level,
        skill,
        user_id,
      },
    });
    res.status(200).json(userSkill);
  } catch (error) {
    console.error('Error updating user skill:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a user skill
const deleteUserSkill = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.userSkill.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting user skill:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createUserSkill,
  getUserSkills,
  getUserSkillById,
  updateUserSkill,
  deleteUserSkill,
};