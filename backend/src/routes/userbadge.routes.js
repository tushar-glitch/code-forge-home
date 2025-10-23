const express = require('express');
const { createUserBadge, getUserBadges, getUserBadgeById, updateUserBadge, deleteUserBadge } = require('../controllers/userbadge.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createUserBadge);
router.get('/', getUserBadges);
router.get('/:id', getUserBadgeById);
router.put('/:id', authenticateToken, updateUserBadge);
router.delete('/:id', authenticateToken, deleteUserBadge);

module.exports = router;