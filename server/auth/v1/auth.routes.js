const express = require('express');
const router = express.Router();
const { loginUser } = require('./login.action.js');
const { logoutUser } = require('./logout.action.js');
const { refreshToken } = require('./refreshToken.action.js');
const passport = require('passport');
const {googleAuth} = require('./googleAuth.action.js');

router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);

router.get('/google', passport.authenticate('google', 
    { scope: ['profile', 'email',    
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'] 
    }));
router.get('/google/callback', 
    passport.authenticate('google', { session: false }), googleAuth);

module.exports = router;
