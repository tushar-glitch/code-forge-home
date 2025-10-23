const express = require('express');
const { createCandidate, getCandidates, getCandidateById, updateCandidate, deleteCandidate } = require('../controllers/candidate.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createCandidate);
router.get('/', getCandidates);
router.get('/:id', getCandidateById);
router.put('/:id', authenticateToken, updateCandidate);
router.delete('/:id', authenticateToken, deleteCandidate);

module.exports = router;