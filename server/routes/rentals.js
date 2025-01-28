const express = require('express');
const router = express.Router();
const controllers = require('../genericControllers/rentalController.js');
const auth = require('../middleware/authToken.js');

router.post('/', auth.verifyToken, controllers.createRental);
router.get('/:id', controllers.readRental);
router.put('/:id', auth.verifyToken, controllers.updateRental);   
router.delete('/:id', auth.verifyToken, controllers.deleteRental);

module.exports = router;
