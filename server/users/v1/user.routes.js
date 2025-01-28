const express = require('express');
const router = express.Router();
const {createUser} = require('./create.user.action.js');
const {readUser} = require('./read.user.action.js');
const {updateUser} = require('./update.user.action.js');
const {deleteUser} = require('./delete.user.action.js');
const auth = require('../../middleware/authToken.js');

router.post('/', createUser);
router.get('/:id', readUser);// Put an admin protection
router.put('/:id', auth.verifyToken, updateUser);
router.delete('/:id', auth.verifyToken, deleteUser);

module.exports = router;
