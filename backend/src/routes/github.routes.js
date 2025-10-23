const express = require('express');
const { createRepoAndRunTests } = require('../controllers/github.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/create-repo-and-run-tests', authenticateToken, createRepoAndRunTests);

module.exports = router;