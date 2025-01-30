const jwt = require('jsonwebtoken');
const User = require('../../users/v1/user.model');


const logoutUser = async (req, res) => {
    const refreshToken = req.cookies['refresh-token'];
    if (!refreshToken) return res.status(400).send({ error: 'Refresh token missing' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);
        if (user && user.refreshToken === refreshToken)  {     
            user.refreshToken = null;
            await user.save();
        }
        res.clearCookie('auth-token', { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.clearCookie('refresh-token', { httpOnly: true, secure: true, sameSite: 'Strict' })
        res.status(204).send()
    } catch (error) {
        res.status(400).send({ error: 'Invalid token' });
    }
}

module.exports = { logoutUser };