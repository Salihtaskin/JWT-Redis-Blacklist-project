const jwt = require('jsonwebtoken');
const { client } = require('../config/redis');
const { JWT_SECRET } = require('../services/tokenService');

const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid token format' });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify JWT signature and expiration
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Check if token is in Redis blacklist by jti
        const jti = decoded.jti;
        const isBlacklisted = await client.get(`bl:${jti}`);
        
        if (isBlacklisted) {
            return res.status(401).json({ error: 'Token has been revoked' });
        }

        // Attach user info to request
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        console.error('Auth Middleware Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    requireAuth
};
