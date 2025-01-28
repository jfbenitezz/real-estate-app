const express = require('express');
const router = express.Router();
const controllers = require('../genericControllers/catalogController');

router.get('/', controllers.getCatalog);

module.exports = router;