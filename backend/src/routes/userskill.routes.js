const express = require('express');
const { createUserSkill, getUserSkills, getUserSkillById, updateUserSkill, deleteUserSkill } = require('../controllers/userskill.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createUserSkill);
router.get('/', getUserSkills);
router.get('/:id', getUserSkillById);
router.put('/:id', authenticateToken, updateUserSkill);
router.delete('/:id', authenticateToken, deleteUserSkill);

module.exports = router;