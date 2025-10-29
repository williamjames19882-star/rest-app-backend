const express = require('express');
const { upload, uploadToCloudinary } = require('../utils/uploadHelper');

const router = express.Router();

// Single image upload route
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file, 'restaurant');
    
    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      message: error.message 
    });
  }
});

// Multiple images upload route
router.post('/images', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Upload all files to Cloudinary
    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file, 'restaurant')
    );
    
    const results = await Promise.all(uploadPromises);
    
    res.json({
      success: true,
      uploads: results.map(result => ({
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        bytes: result.bytes
      }))
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload images',
      message: error.message 
    });
  }
});

module.exports = router;

