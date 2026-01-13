const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../config/email');
const { loginLimiter, passwordResetLimiter, createAccountLimiter } = require('../middleware/rateLimiter');
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

// Forgot Password - Request reset
router.post('/forgot-password', passwordResetLimiter, async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Don't reveal if email exists or not for security
            return res.status(200).json({ message: 'If an account exists with this email, a reset code has been sent' });
        }

        // Generate a 6-digit reset code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const resetToken = crypto.createHash('sha256').update(resetCode).digest('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Send email with reset code
        const emailResult = await sendPasswordResetEmail(email, resetCode);
        
        if (!emailResult.success) {
            console.error('Failed to send email:', emailResult.error);
            // Still return success to not reveal if email exists
        }

        console.log(`Password reset code for ${email}: ${resetCode}`);

        res.status(200).json({ 
            message: 'If an account exists with this email, a reset code has been sent'
        });
    } catch (error) {
        console.error('Error in /forgot-password route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify reset code
router.post('/verify-reset-code', async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({ message: 'Email and code are required' });
        }

        const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
        
        const user = await User.findOne({
            email: email.toLowerCase(),
            resetPasswordToken: hashedCode,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset code' });
        }

        // Generate a temporary token for password reset
        const tempToken = jwt.sign(
            { id: user._id, purpose: 'password-reset' },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        res.status(200).json({ 
            message: 'Code verified successfully',
            token: tempToken
        });
    } catch (error) {
        console.error('Error in /verify-reset-code route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        if (decoded.purpose !== 'password-reset') {
            return res.status(400).json({ message: 'Invalid token' });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Hash new password and save
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error in /reset-password route:', error);
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
