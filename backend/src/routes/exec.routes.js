const express = require('express');
const router = express.Router();
const { 
  submitExecution, 
  getExecutionStatus, 
  postExecutionResult 
} = require('../controllers/exec.controller');

// Route for frontend to submit a job
router.post('/submit', submitExecution);

// Route for frontend to poll for status
router.get('/status/:submissionId', getExecutionStatus);

// Internal route for worker to post results
router.post('/internal/results', postExecutionResult);

module.exports = router;
