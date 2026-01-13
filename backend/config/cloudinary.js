const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage for uploaded sketches
const sketchStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lustre/sketches',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        transformation: [{ width: 1024, height: 1024, crop: 'limit' }]
    }
});

// Storage for generated designs
const designStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lustre/designs',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1024, height: 1024, crop: 'limit' }]
    }
});

const uploadSketch = multer({ storage: sketchStorage });
const uploadDesign = multer({ storage: designStorage });

// Helper to upload buffer directly to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'image'
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

module.exports = {
    cloudinary,
    uploadSketch,
    uploadDesign,
    uploadToCloudinary,
    deleteFromCloudinary
};
