const express = require('express');
const router = express.Router();
const {createProperty} = require('./create.property.action.js');
const {readProperty} = require('./read.property.action.js');
const {updateProperty} = require('./update.property.action.js');
const {deleteProperty} = require('./delete.property.action.js');

const auth = require('../../middleware/authToken.js');

router.post('/', auth.verifyToken,createProperty);
router.get('/:id',readProperty);
router.put('/:id', auth.verifyToken,updateProperty); 
router.delete('/:id', auth.verifyToken,deleteProperty);
module.exports = router;

