const express = require('express');
const router = express.Router();
const controllers = require('../controllers/imageController.js');
const {upload} = require('../middleware/multer');
const auth = require('../middleware/authToken.js');

//Falta aplicar middleware para obtener id
router.post('/', upload.array('image',10), controllers.createImages);
router.get('/', controllers.getImages);
router.delete('/', auth.verifyToken, controllers.deleteImages);
router.put('/:id', auth.verifyToken, controllers.updateText);
module.exports = router;
