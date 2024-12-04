const express = require('express');
const router = express.Router();
const controllers = require('../controllers/propertiesController');
const auth = require('../middleware/authToken.js');

router.post('/', auth.verifyToken, controllers.createProperty);
router.get('/:id', controllers.readProperty);
router.put('/:id', auth.verifyToken, controllers.updateProperty); 
router.delete('/:id', auth.verifyToken, controllers.deleteProperty);
module.exports = router;

