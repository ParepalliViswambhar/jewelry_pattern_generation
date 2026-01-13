const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { 
            type: String, 
            required: true, 
            unique: true,
            lowercase: true,
            trim: true
        },
        phone: { type: String, required: false },
        password: { type: String, required: false },
        oauthProviders: [{
            provider: {
                type: String,
                enum: ['google', 'github']
            },
            providerId: String,
            accessToken: String
        }],
        profilePicture: { 
            type: String, 
            default: null 
        },
        lastLogin: { 
            type: Date, 
            default: Date.now 
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        resetPasswordToken: {
            type: String,
            default: null
        },
        resetPasswordExpires: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
