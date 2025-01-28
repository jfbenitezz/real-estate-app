const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authToken.js');
const {createPurchase} = require('./create.purchase.action.js');
const {readPurchase} = require('./read.purchase.action.js');
const {updatePurchase} = require('./update.purchase.action.js');
const {deletePurchase} = require('./delete.purchase.action.js');

router.post('/', auth.verifyToken, createPurchase);
router.get('/:id', readPurchase);
router.put('/:id', auth.verifyToken, updatePurchase);   
router.delete('/:id', auth.verifyToken, deletePurchase);

module.exports = router;
