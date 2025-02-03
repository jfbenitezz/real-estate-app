const { generateAccessToken, generateRefreshToken } = require('./createTokens.action.js');

const googleAuth = async (req, res) => {
    try {
      const user = req.user;
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Save refresh token in DB
      user.refreshToken = refreshToken;
      await user.save();

      // Set secure HTTP-only cookies
      res.cookie('auth-token', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
      res.cookie('refresh-token', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });

      res.status(200).json({
        message: 'Google login successful',
        accessToken,
        refreshToken,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email
        }
      });

    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }

  module.exports = { googleAuth };