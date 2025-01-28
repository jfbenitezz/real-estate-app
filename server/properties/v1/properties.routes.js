const express = require('express');
const router = express.Router();
const {createProperty} = require('./controllers/create.property.js');
const {readProperty} = require('./controllers/read.property.js');
const {updateProperty} = require('./controllers/update.property.js');
const {deleteProperty} = require('./controllers/delete.property.js');

const auth = require('../../middleware/authToken.js');

router.post('/', auth.verifyToken,createProperty);
router.get('/:id',readProperty);
router.put('/:id', auth.verifyToken,updateProperty); 
router.delete('/:id', auth.verifyToken,deleteProperty);
console.log('Properties route loaded');
module.exports = router;

