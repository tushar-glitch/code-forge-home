const express = require('express');
const { createChallenge, getChallenges, getChallengeById, updateChallenge, deleteChallenge } = require('../controllers/challenge.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createChallenge);
router.get('/', authenticateToken, getChallenges);
router.get('/:id', authenticateToken, getChallengeById);
router.put('/:id', authenticateToken, updateChallenge);
router.delete('/:id', authenticateToken, deleteChallenge);

module.exports = router;