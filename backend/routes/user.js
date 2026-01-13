const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -oauthProviders.accessToken');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            username: user.username,
            phone: user.phone || null,
            profilePicture: user.profilePicture,
            isVerified: user.isVerified,
            lastLogin: user.lastLogin,
            oauthProviders: user.oauthProviders.map(provider => ({
                provider: provider.provider
            }))
        });
    } catch (error) {
        console.error('Error in /profile route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
