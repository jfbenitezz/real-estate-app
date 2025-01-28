const express = require('express');
const router = express.Router();
const { getCatalog } = require('./read.catalog.action');
const {getFilterOptions} = require('./read.filters.action');
router.get('/', getCatalog);
router.get('/:field', getFilterOptions);

module.exports = router;