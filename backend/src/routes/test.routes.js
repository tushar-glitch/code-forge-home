const express = require('express');
const { createTest, getTests, getTestById, updateTest, deleteTest } = require('../controllers/test.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createTest);
router.get('/', getTests);
router.get('/:id', getTestById);
router.put('/:id', authenticateToken, updateTest);
router.delete('/:id', authenticateToken, deleteTest);

module.exports = router;