const express = require('express');
const { runEvaluation } = require('../controllers/evaluation.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, runEvaluation);

module.exports = router;