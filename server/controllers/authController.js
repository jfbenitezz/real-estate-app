const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { validateLogin } = require('../middleware/validator');

const generateAccessToken = (user) => {
    return jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

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



const refreshToken = async (req, res) => {
    const refreshToken = req.cookies['refresh-token'];
    if (!refreshToken) return res.status(401).send({ error: 'Refresh token missing' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).send({ error: 'Invalid refresh token' });
        }

        const newAccessToken = generateAccessToken(user);

        res.cookie('auth-token', newAccessToken, { httpOnly: true, secure: true });
        res.status(200).json({ 
            accessToken: newAccessToken,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(403).send({ error: 'Invalid refresh token' });
    }
};


const logoutUser = async (req, res) => {
    const refreshToken = req.cookies['refresh-token'];
    if (!refreshToken) return res.status(400).send({ error: 'Refresh token missing' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
        res.clearCookie('auth-token');
        res.clearCookie('refresh-token');
        res.status(204).send()
    } catch (error) {
        res.status(400).send({ error: 'Invalid token' });
    }
}


module.exports = { loginUser, refreshToken, logoutUser };