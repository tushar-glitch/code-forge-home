const express = require('express');
const { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany } = require('../controllers/company.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', createCompany);
router.get('/', getCompanies);
router.get('/:id', getCompanyById);
router.put('/:id', authenticateToken, updateCompany);
router.delete('/:id', authenticateToken, deleteCompany);

module.exports = router;