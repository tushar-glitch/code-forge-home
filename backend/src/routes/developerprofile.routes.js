const express = require('express');
const { createDeveloperProfile, getDeveloperProfiles, getDeveloperProfileById, updateDeveloperProfile, deleteDeveloperProfile } = require('../controllers/developerprofile.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createDeveloperProfile);
router.get('/', getDeveloperProfiles);
router.get('/:id', getDeveloperProfileById);
router.put('/:id', authenticateToken, updateDeveloperProfile);
router.delete('/:id', authenticateToken, deleteDeveloperProfile);

module.exports = router;