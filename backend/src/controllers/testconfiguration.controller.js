const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new test configuration
const createTestConfiguration = async (req, res) => {
  const { description, enabled, name, test_id, test_script } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const testConfiguration = await prisma.testConfiguration.create({
      data: {
        description,
        enabled,
        name,
        test_id,
        test_script,
      },
    });
    res.status(201).json(testConfiguration);
  } catch (error) {
    console.error('Error creating test configuration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all test configurations
const getTestConfigurations = async (req, res) => {
  const { test_id } = req.query;
  try {
    const where = {};
    if (test_id) {
      where.test_id = parseInt(test_id);
    }
    const testConfigurations = await prisma.testConfiguration.findMany({ where });
    res.status(200).json(testConfigurations);
  } catch (error) {
    console.error('Error fetching test configurations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single test configuration by ID
const getTestConfigurationById = async (req, res) => {
  const { id } = req.params;
  try {
    const testConfiguration = await prisma.testConfiguration.findUnique({
      where: { id },
    });
    if (!testConfiguration) {
      return res.status(404).json({ message: 'Test configuration not found' });
    }
    res.status(200).json(testConfiguration);
  } catch (error) {
    console.error('Error fetching test configuration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a test configuration
const updateTestConfiguration = async (req, res) => {
  const { id } = req.params;
  const { description, enabled, name, test_id, test_script } = req.body;
  try {
    const testConfiguration = await prisma.testConfiguration.update({
      where: { id },
      data: {
        description,
        enabled,
        name,
        test_id,
        test_script,
      },
    });
    res.status(200).json(testConfiguration);
  } catch (error) {
    console.error('Error updating test configuration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a test configuration
const deleteTestConfiguration = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.testConfiguration.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting test configuration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createTestConfiguration,
  getTestConfigurations,
  getTestConfigurationById,
  updateTestConfiguration,
  deleteTestConfiguration,
};