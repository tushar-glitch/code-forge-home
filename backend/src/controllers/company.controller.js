const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new company
const createCompany = async (req, res) => {
  const { email, name } = req.body;

  try {
    const company = await prisma.company.create({
      data: {
        email,
        name,
      },
    });
    res.status(201).json(company);
  } catch (error) {
    if (error.code === 'P2002') { // Unique constraint failed for email
      return res.status(409).json({ message: 'Company with this email already exists' });
    }
    console.error('Error creating company:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all companies
const getCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.status(200).json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single company by ID
const getCompanyById = async (req, res) => {
  const { id } = req.params;
  try {
    const company = await prisma.company.findUnique({
      where: { id: parseInt(id) },
    });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a company
const updateCompany = async (req, res) => {
  const { id } = req.params;
  const { email, name } = req.body;
  try {
    const company = await prisma.company.update({
      where: { id: parseInt(id) },
      data: {
        email,
        name,
      },
    });
    res.status(200).json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a company
const deleteCompany = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.company.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};