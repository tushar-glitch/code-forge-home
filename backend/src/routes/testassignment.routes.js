const express = require('express');
const { createTestAssignment, getTestAssignments, getTestAssignmentById, getTestAssignmentByAccessLink, updateTestAssignment, deleteTestAssignment, updateTestAssignmentByAccessLink } = require('../controllers/testassignment.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createTestAssignment);
router.get('/', getTestAssignments);
router.get('/:id', getTestAssignmentById);
router.get('/access/:accessLink', getTestAssignmentByAccessLink);
router.put('/access/:accessLink', updateTestAssignmentByAccessLink);
router.put('/:id', authenticateToken, updateTestAssignment);
router.delete('/:id', authenticateToken, deleteTestAssignment);

module.exports = router;