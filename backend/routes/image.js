const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const Design = require('../models/Design');

// Use memory storage for processing
const upload = multer({ storage: multer.memoryStorage() });

// Upload sketch, process with ML, save both to Cloudinary, and store in DB
router.post('/generate', authenticateToken, upload.single('imageInput'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        // 1. Upload sketch to Cloudinary
        const sketchResult = await uploadToCloudinary(req.file.buffer, 'lustre/sketches');
        
        // 2. Send to ML service for processing
        const formData = new FormData();
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
        formData.append('imageInput', blob, req.file.originalname);

        const mlResponse = await axios.post(
            `${process.env.ML_SERVICE_URL}/process-image`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'arraybuffer',
            }
        );

        // 3. Upload generated design to Cloudinary
        const designBuffer = Buffer.from(mlResponse.data);
        const designResult = await uploadToCloudinary(designBuffer, 'lustre/designs');

        // 4. Save to database
        const design = new Design({
            user: req.user.id,
            sketchUrl: sketchResult.secure_url,
            sketchPublicId: sketchResult.public_id,
            designUrl: designResult.secure_url,
            designPublicId: designResult.public_id,
            title: req.body.title || 'Untitled Design'
        });
        await design.save();

        res.status(201).json({
            message: 'Design generated successfully',
            design: {
                id: design._id,
                sketchUrl: design.sketchUrl,
                designUrl: design.designUrl,
                createdAt: design.createdAt
            }
        });

    } catch (error) {
        console.error('Error generating design:', error.message);
        res.status(500).json({ message: 'Error generating design' });
    }
});

// Get user's gallery
router.get('/gallery', authenticateToken, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const filter = req.query.filter; // 'favorites' or undefined

        const query = { user: req.user.id };
        if (filter === 'favorites') {
            query.isFavorite = true;
        }

        const designs = await Design.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('sketchUrl designUrl title createdAt isFavorite downloadCount');

        const total = await Design.countDocuments(query);

        res.json({
            designs,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Error fetching gallery:', error);
        res.status(500).json({ message: 'Error fetching gallery' });
    }
});

// Get single design
router.get('/design/:id', authenticateToken, async (req, res) => {
    try {
        const design = await Design.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!design) {
            return res.status(404).json({ message: 'Design not found' });
        }

        res.json(design);
    } catch (error) {
        console.error('Error fetching design:', error);
        res.status(500).json({ message: 'Error fetching design' });
    }
});

// Delete design
router.delete('/design/:id', authenticateToken, async (req, res) => {
    try {
        const design = await Design.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!design) {
            return res.status(404).json({ message: 'Design not found' });
        }

        // Delete from Cloudinary
        await deleteFromCloudinary(design.sketchPublicId);
        await deleteFromCloudinary(design.designPublicId);

        // Delete from database
        await Design.deleteOne({ _id: design._id });

        res.json({ message: 'Design deleted successfully' });
    } catch (error) {
        console.error('Error deleting design:', error);
        res.status(500).json({ message: 'Error deleting design' });
    }
});

// Toggle favorite
router.patch('/design/:id/favorite', authenticateToken, async (req, res) => {
    try {
        const design = await Design.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!design) {
            return res.status(404).json({ message: 'Design not found' });
        }

        design.isFavorite = !design.isFavorite;
        await design.save();

        res.json({ isFavorite: design.isFavorite });
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ message: 'Error updating design' });
    }
});

// Track download
router.patch('/design/:id/download', authenticateToken, async (req, res) => {
    try {
        await Design.updateOne(
            { _id: req.params.id, user: req.user.id },
            { $inc: { downloadCount: 1 } }
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error tracking download:', error);
        res.status(500).json({ message: 'Error tracking download' });
    }
});

// Bulk download - returns URLs for client-side zip creation
router.post('/designs/bulk-download', authenticateToken, async (req, res) => {
    try {
        const { designIds } = req.body;
        
        if (!designIds || !Array.isArray(designIds) || designIds.length === 0) {
            return res.status(400).json({ message: 'No designs selected' });
        }

        if (designIds.length > 20) {
            return res.status(400).json({ message: 'Maximum 20 designs per download' });
        }

        const designs = await Design.find({
            _id: { $in: designIds },
            user: req.user.id
        }).select('designUrl sketchUrl title');

        // Increment download counts
        await Design.updateMany(
            { _id: { $in: designIds }, user: req.user.id },
            { $inc: { downloadCount: 1 } }
        );

        res.json({ designs });
    } catch (error) {
        console.error('Error bulk download:', error);
        res.status(500).json({ message: 'Error preparing download' });
    }
});

// Legacy upload endpoint (for backward compatibility)
router.post('/upload', authenticateToken, upload.single('imageInput'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(201).json({ message: 'Image uploaded successfully' });
});

module.exports = router;
