const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authToken.js');
const {createRental} = require('./create.rental.action.js');
const {readRental} = require('./read.rental.action.js');
const {updateRental} = require('./update.rental.action.js');
const {deleteRental} = require('./delete.rental.action.js');

router.post('/', auth.verifyToken, createRental);
router.get('/:id', readRental);
router.put('/:id', auth.verifyToken, updateRental);   
router.delete('/:id', auth.verifyToken, deleteRental);

module.exports = router;
