const express = require('express');
const { createLead, getLeads, getLeadById, updateLead, deleteLead } = require('../controllers/lead.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', createLead);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.put('/:id', authenticateToken, updateLead);
router.delete('/:id', authenticateToken, deleteLead);

module.exports = router;