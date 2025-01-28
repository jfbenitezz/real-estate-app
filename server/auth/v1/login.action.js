const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../users/v1/userModel');
const { validateLogin } = require('../../middleware/validator');
const { generateAccessToken, generateRefreshToken } = require('./createTokens.action');

const loginUser = async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }   

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(401).json({ error: 'Invalid email' });
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    res.cookie('auth-token', accessToken, { httpOnly: true, secure: true });
    res.cookie('refresh-token', refreshToken, { httpOnly: true, secure: true });
    res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
}

module.exports = {loginUser}