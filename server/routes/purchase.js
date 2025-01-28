const express = require('express');
const router = express.Router();
const controllers = require('../genericControllers/purchaseControllers.js');
const auth = require('../middleware/authToken.js');

router.post('/', auth.verifyToken, controllers.createPurchase);
router.get('/:id', controllers.readPurchase);
router.put('/:id', auth.verifyToken, controllers.updatePurchase);   
router.delete('/:id', auth.verifyToken, controllers.deletePurchase);

module.exports = router;
