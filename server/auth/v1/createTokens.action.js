const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign(
        { _id: user._id, role: user.role || "client" }, 
        process.env.TOKEN_SECRET,
        { expiresIn: "15m" }
    );
};



const generateRefreshToken = (user) => {
    return jwt.sign({ _id: user._id , role: user.role || "client"}, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: '30d' }
    );
};

module.exports = { generateAccessToken, generateRefreshToken };