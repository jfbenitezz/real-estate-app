const express = require('express');
const router = express.Router();
const controllers = require('../genericControllers/filterController.js');

router.get('/:field', controllers.getFilterOptions);

module.exports = router;