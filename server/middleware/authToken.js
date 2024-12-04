const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).send({ error: 'Authorization header missing' });
    
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. Token is missing in the request headers.' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userId = decoded._id;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Access denied. Token has expired.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Access denied. Invalid token format.' });
        } else {
            return res.status(401).json({ error: 'Access denied. Token verification failed.' });
        }
    }
}

module.exports = { verifyToken };
