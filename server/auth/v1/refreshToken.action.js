const jwt = require('jsonwebtoken');
const User = require('../../users/v1/user.model');
const { generateAccessToken } = require('./createTokens.action');

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
        return res.status(500).send({ error: 'Error refreshing access token' });
    }
};

module.exports = {refreshToken};