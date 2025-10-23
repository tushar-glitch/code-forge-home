const express = require('express');
const { createContestParticipant, getContestParticipants, getContestParticipantById, updateContestParticipant, deleteContestParticipant } = require('../controllers/contestparticipant.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createContestParticipant);
router.get('/', getContestParticipants);
router.get('/:id', getContestParticipantById);
router.put('/:id', authenticateToken, updateContestParticipant);
router.delete('/:id', authenticateToken, deleteContestParticipant);

module.exports = router;