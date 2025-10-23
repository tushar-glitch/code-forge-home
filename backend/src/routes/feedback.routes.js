const express = require('express');
const { createFeedback, getFeedback, getFeedbackById, updateFeedback, deleteFeedback } = require('../controllers/feedback.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createFeedback);
router.get('/', getFeedback);
router.get('/:id', getFeedbackById);
router.put('/:id', authenticateToken, updateFeedback);
router.delete('/:id', authenticateToken, deleteFeedback);

module.exports = router;