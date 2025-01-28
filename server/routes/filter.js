const express = require('express');
const router = express.Router();
const controllers = require('../properties/v1/read.filters.action.js');

router.get('/:field', controllers.getFilterOptions);

module.exports = router;