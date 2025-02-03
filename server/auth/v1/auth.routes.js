const express = require('express');
const router = express.Router();
const { loginUser } = require('./login.action.js');
const { logoutUser } = require('./logout.action.js');
const { refreshToken } = require('./refreshToken.action.js');

router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);

const passport = require('passport');
const {googleAuth} = require('./googleAuth.action.js');
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { session: false }), googleAuth);

module.exports = router;
