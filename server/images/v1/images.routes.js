const express = require('express');
const router = express.Router();
const {createImages} = require('./create.images.action.js');
const {getImages} = require('./get.images.action.js');
const {deleteImages} = require('./delete.images.action.js');
const {updateText} = require('./updateText.image.js');
const {upload} = require('../../middleware/multer.js');
const auth = require('../../middleware/authToken.js');

//Falta aplicar middleware para obtener id
router.post('/', upload.array('image',10), createImages);
router.get('/', getImages);
router.delete('/', auth.verifyToken, deleteImages);
router.put('/:id', auth.verifyToken, updateText);
module.exports = router;
