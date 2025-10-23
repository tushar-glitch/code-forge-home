const express = require('express');
const { sendTestInvitation } = require('../controllers/invitation.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/send-test-invitation', authenticateToken, sendTestInvitation);

module.exports = router;