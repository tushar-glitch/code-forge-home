const express = require('express');
const { createTestResult, getTestResults, getTestResultById, updateTestResult, deleteTestResult } = require('../controllers/testresult.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createTestResult);
router.get('/', getTestResults);
router.get('/:id', getTestResultById);
router.put('/:id', authenticateToken, updateTestResult);
router.delete('/:id', authenticateToken, deleteTestResult);

module.exports = router;