const express = require('express');
const {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  updateSubmission,
  deleteSubmission
} = require('../controllers/submission.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// ✅ Candidate-friendly (no token)
router.post('/', createSubmission);
router.get('/', getSubmissions);
router.get('/:id', getSubmissionById);

// ✅ Only recruiter actions need auth
router.put('/:id', authenticateToken, updateSubmission);
router.delete('/:id', authenticateToken, deleteSubmission);

module.exports = router;
