const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { generateToken } = require('../services/tokenService');
const { client } = require('../config/redis');

const router = express.Router();

// Hardcoded demo user
const DEMO_USER = {
    id: 'u_123456',
    email: 'demo@example.com',
    password: 'password123',
    role: 'user'
};

/**
 * POST /auth/login
 * Returns a new JWT access token
 */
router.post('/login', express.json(), (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const { token, jti, exp } = generateToken(DEMO_USER);

    res.json({
        message: 'Login successful',
        token,
        token_info: { jti, exp }
    });
});

/**
 * GET /auth/profile
 * Protected route, returns decoded user info
 */
router.get('/profile', requireAuth, (req, res) => {
    // req.user contains the decoded JWT payload
    res.json({
        message: 'Profile accessed successfully',
        user: req.user
    });
});

/**
 * POST /auth/logout
 * Revokes the current token by adding its jti to the Redis blacklist
 */
router.post('/logout', requireAuth, async (req, res) => {
    try {
        const { jti, exp } = req.user;
        
        // Calculate remaining time in seconds
        const currentTime = Math.floor(Date.now() / 1000);
        const remainingTime = exp - currentTime;

        // Only blacklist if token hasn't naturally expired yet
        if (remainingTime > 0) {
            // Set Redis key with expiration equal to remaining JWT lifetime
            await client.setEx(`bl:${jti}`, remainingTime, 'revoked');
        }

        res.json({ message: 'Logout successful, token revoked' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Failed to logout' });
    }
});

module.exports = router;
