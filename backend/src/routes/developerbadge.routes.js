const express = require('express');
const { createDeveloperBadge, getDeveloperBadges, getDeveloperBadgeById, updateDeveloperBadge, deleteDeveloperBadge } = require('../controllers/developerbadge.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createDeveloperBadge);
router.get('/', getDeveloperBadges);
router.get('/:id', getDeveloperBadgeById);
router.put('/:id', authenticateToken, updateDeveloperBadge);
router.delete('/:id', authenticateToken, deleteDeveloperBadge);

module.exports = router;