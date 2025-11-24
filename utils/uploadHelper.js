const cloudinary = require('../config/cloudinary');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload file to Cloudinary
const uploadToCloudinary = async (file, folder = 'restaurant', applyTransformations = true) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    // Build upload options
    const uploadOptions = {
      folder: folder,
      resource_type: 'auto',
    };

    // Apply transformations only if requested (for banners, menu items, etc.)
    if (applyTransformations) {
      uploadOptions.transformation = [
        { width: 1200, height: 800, crop: 'fill', quality: 'auto' }
      ];
    } else {
      // For category images, preserve original size and quality
      uploadOptions.quality = 'auto';
    }

    // Create upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Pipe the buffer to upload stream
    uploadStream.end(file.buffer);
  });
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary
};

