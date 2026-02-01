const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No token provided.'
            });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token.'
            });
        }
        
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid token.'
        });
    }
};

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
    await auth(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Admin privileges required.'
            });
        }
        next();
    });
};

// Middleware to check if user is professor or admin
const professorAuth = async (req, res, next) => {
    await auth(req, res, () => {
        if (req.user.role !== 'professor' && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Professor or admin privileges required.'
            });
        }
        next();
    });
};

module.exports = { auth, adminAuth, professorAuth, JWT_SECRET };
