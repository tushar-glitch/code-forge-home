const express = require('express');
const { createSubmission, getSubmissions, getSubmissionById, updateSubmission, deleteSubmission } = require('../controllers/submission.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', createSubmission);
router.get('/', getSubmissions);
router.get('/:id', getSubmissionById);
router.put('/:id', authenticateToken, updateSubmission);
router.delete('/:id', authenticateToken, deleteSubmission);

module.exports = router;