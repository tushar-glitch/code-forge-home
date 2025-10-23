const express = require('express');
const { getTestSummary, getTestAssignmentsWithResults, getDashboardStats, getWeeklySubmissions, getPassFailRatio, getActivityFeed } = require('../controllers/dashboard.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/tests/:testId/summary', authenticateToken, getTestSummary);
router.get('/tests/:testId/assignments-results', authenticateToken, getTestAssignmentsWithResults);
router.get('/stats', authenticateToken, getDashboardStats);
router.get('/weekly-submissions', authenticateToken, getWeeklySubmissions);
router.get('/pass-fail-ratio', authenticateToken, getPassFailRatio);
router.get('/activity-feed', authenticateToken, getActivityFeed);

module.exports = router;