const express = require('express');
const { createProfile, getProfiles, getProfileById, updateProfile, deleteProfile } = require('../controllers/profile.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createProfile);
router.get('/', getProfiles);
router.get('/:id', getProfileById);
router.put('/:id', authenticateToken, updateProfile);
router.delete('/:id', authenticateToken, deleteProfile);

module.exports = router;