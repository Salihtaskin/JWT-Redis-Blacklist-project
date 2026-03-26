const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const EXPIRES_IN = '15m'; // 15 minutes

/**
 * Generate a new JWT token
 * @param {Object} user - User payload
 * @returns {Object} { token, jti, exp }
 */
const generateToken = (user) => {
    const jti = uuidv4();
    const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        jti: jti
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
    const decoded = jwt.decode(token);

    return {
        token,
        jti,
        exp: decoded.exp
    };
};

module.exports = {
    generateToken,
    JWT_SECRET
};
