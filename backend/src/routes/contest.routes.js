const express = require('express');
const { createContest, getContests, getContestById, updateContest, deleteContest } = require('../controllers/contest.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createContest);
router.get('/', getContests);
router.get('/:id', getContestById);
router.put('/:id', authenticateToken, updateContest);
router.delete('/:id', authenticateToken, deleteContest);

module.exports = router;