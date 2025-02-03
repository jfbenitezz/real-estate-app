const express = require('express');
const router = express.Router();
const {createUserController, readUserController, updateUserController, deleteUserController, createEventController} = require('./user.controller.js');
const auth = require('../../middleware/authToken.js');

router.post('/', createUserController);
router.get('/:id', readUserController);// Put an admin protection
router.put('/:id', auth.verifyToken, updateUserController);
router.delete('/:id', auth.verifyToken, deleteUserController);

router.post('/create-event', auth.verifyToken, createEventController);

module.exports = router;
