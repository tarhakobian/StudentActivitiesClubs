const express = require('express');
const { register, login, getUserProfileData } = require('../service/userService');
const { authenticate } = require("../middlewear/securityMiddlewear");

const router = express.Router();

/**
 * @route POST /register
 * @desc Register a new user and return a JWT token
 */
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    try {
        const jwtToken = await register(email, password, name);
        res.status(201).json({ token: jwtToken });
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route POST /login
 * @desc Login a user and return a JWT token
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const token = await login(email, password);
        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

/**
 * @route GET /info/:userId
 * @desc Get profile information for a specific user
 */
router.get('/info/:userId', authenticate, async (req, res) => {
    const targetUserId = req.params['userId'];
    const userId = req.user.userId;

    try {
        const targetUserData = await getUserProfileData(userId, targetUserId);
        res.status(200).json(targetUserData);
    } catch (error) {
        console.error('Error retrieving user data:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
