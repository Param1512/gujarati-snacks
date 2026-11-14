const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route   POST /api/upload
 * @desc    Upload an image (base64 data URI or remote URL) to Cloudinary
 * @access  Protected / Admin
 */
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { image, folder = 'gujarati-snacks' } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No image provided for upload',
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      format: uploadResponse.format,
      width: uploadResponse.width,
      height: uploadResponse.height,
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed',
    });
  }
});

module.exports = router;
