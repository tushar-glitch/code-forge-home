const express = require('express');
const { createTestConfiguration, getTestConfigurations, getTestConfigurationById, updateTestConfiguration, deleteTestConfiguration } = require('../controllers/testconfiguration.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createTestConfiguration);
router.get('/', getTestConfigurations);
router.get('/:id', getTestConfigurationById);
router.put('/:id', authenticateToken, updateTestConfiguration);
router.delete('/:id', authenticateToken, deleteTestConfiguration);

module.exports = router;