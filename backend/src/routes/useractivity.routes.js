const express = require('express');
const { createUserActivity, getUserActivities, getUserActivityById, updateUserActivity, deleteUserActivity } = require('../controllers/useractivity.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createUserActivity);
router.get('/', getUserActivities);
router.get('/:id', getUserActivityById);
router.put('/:id', authenticateToken, updateUserActivity);
router.delete('/:id', authenticateToken, deleteUserActivity);

module.exports = router;