const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const { loginLimiter, createAccountLimiter } = require('../middleware/rateLimiter');
const { authenticateToken } = require('../middleware/auth');

// Get current user (validate token)
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('fullName email profilePicture');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user: { fullName: user.fullName, email: user.email, profilePicture: user.profilePicture } });
    } catch (error) {
        console.error('Error in /me route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create account
router.post('/create', createAccountLimiter, async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;
        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, phone, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        console.error('Error in /create route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !user.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            user: { email: user.email, fullName: user.fullName } 
        });
    } catch (error) {
        console.error('Error in /login route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Google OAuth
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email', 'openid'] 
}));

router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login',
        failureFlash: true 
    }),
    (req, res) => {
        try {
            const token = jwt.sign(
                { id: req.user.id }, 
                process.env.JWT_SECRET, 
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );
            res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
        } catch (error) {
            console.error('Token generation error:', error);
            res.redirect('/login?error=token_generation_failed');
        }
    }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { 
    scope: ['user:email', 'read:user', 'profile'] 
}));

router.get('/github/callback',
    passport.authenticate('github', { 
        failureRedirect: '/login',
        failureFlash: true 
    }),
    (req, res) => {
        try {
            const token = jwt.sign(
                { id: req.user.id }, 
                process.env.JWT_SECRET, 
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );
            res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
        } catch (error) {
            console.error('Token generation error:', error);
            res.redirect('/login?error=token_generation_failed');
        }
    }
);

module.exports = router;
