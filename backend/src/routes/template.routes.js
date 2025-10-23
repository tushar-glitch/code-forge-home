
const express = require('express');
const { getTemplates } = require('../controllers/template.controller');

const router = express.Router();

router.get('/', getTemplates);

module.exports = router;
