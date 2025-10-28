const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new test
const createTest = async (req, res) => {
  let { instructions, primary_language, test_title, time_limit, files_json, dependencies, test_files_json, technology, challengeId, test_configurations } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    if (challengeId) {
      const challenge = await prisma.challenge.findUnique({
        where: { id: challengeId },
      });

      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }

      instructions = challenge.description;
      files_json = challenge.files_json;
      dependencies = challenge.dependencies;
      test_files_json = challenge.test_files_json;
    }

    const result = await prisma.$transaction(async (prisma) => {
      const test = await prisma.test.create({
        data: {
          instructions,
          primary_language,
          test_title,
          time_limit,
          files_json,
          dependencies,
          test_files_json,
          technology,
          ...(challengeId && { Challenge: { connect: { id: challengeId } } }),
          User: {
            connect: { id: userId },
          },
          Recruiter: {
            connect: { id: userId },
          },
        },
      });

      if (test_configurations && test_configurations.length > 0) {
        await prisma.testConfiguration.createMany({
          data: test_configurations.map((config) => ({
            ...config,
            test_id: test.id,
          })),
        });
      }

      return test;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all tests
const getTests = async (req, res) => {
  const userId = req.userId; // Assuming userId is available from authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }
  //password-1%nLPgE3ITjhg

  console.log('Fetching tests for userId:', userId);
  try {
    const tests = await prisma.test.findMany({
      where: {
        Recruiter: {
          id: userId,
        },
      },
    });
    console.log('Found tests:', tests);
    res.status(200).json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single test by ID
const getTestById = async (req, res) => {
  const { id } = req.params;
  try {
    const test = await prisma.test.findUnique({
      where: { id: parseInt(id) },
    });
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.status(200).json(test);
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a test
const updateTest = async (req, res) => {
  const { id } = req.params;
  const { instructions, primary_language, project_id, test_title, time_limit } = req.body;
  try {
    const test = await prisma.test.update({
      where: { id: parseInt(id) },
      data: {
        instructions,
        primary_language,
        project_id,
        test_title,
        time_limit,
      },
    });
    res.status(200).json(test);
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a test
const deleteTest = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.test.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createTest,
  getTests,
  getTestById,
  updateTest,
  deleteTest,
};