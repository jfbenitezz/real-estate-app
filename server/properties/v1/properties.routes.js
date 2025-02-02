const express = require('express');
const router = express.Router();
const {createPropertyController, readPropertyController,
     updatePropertyController, deletePropertyController} = require('./properties.controller.js');

const auth = require('../../middleware/authToken.js');

router.post('/', auth.verifyToken, createPropertyController);
router.get('/:id', readPropertyController);
router.put('/:id', auth.verifyToken, updatePropertyController); 
router.delete('/:id', auth.verifyToken, deletePropertyController);
module.exports = router;

