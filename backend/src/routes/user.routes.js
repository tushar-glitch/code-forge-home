const express = require('express');
const { getUserRole } = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/:id/role', authenticateToken, getUserRole);

module.exports = router;