const express = require('express');
const router = express.Router();
const { loginUser } = require('./login.action.js');
const { logoutUser } = require('./logout.action.js');
const { refreshToken } = require('./refreshToken.action.js');

router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);

module.exports = router;
