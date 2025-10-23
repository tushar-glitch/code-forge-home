const express = require('express');
const { createRecruiter, getRecruiters, getRecruiterById, updateRecruiter, deleteRecruiter } = require('../controllers/recruiter.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createRecruiter);
router.get('/', getRecruiters);
router.get('/:id', getRecruiterById);
router.put('/:id', authenticateToken, updateRecruiter);
router.delete('/:id', authenticateToken, deleteRecruiter);

module.exports = router;