const mongoose = require('mongoose');

const designSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        sketchUrl: {
            type: String,
            required: true
        },
        sketchPublicId: {
            type: String,
            required: true
        },
        designUrl: {
            type: String,
            required: true
        },
        designPublicId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            default: 'Untitled Design'
        },
        status: {
            type: String,
            enum: ['processing', 'completed', 'failed'],
            default: 'completed'
        }
    },
    { timestamps: true }
);

// Index for faster queries by user
designSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Design', designSchema);
