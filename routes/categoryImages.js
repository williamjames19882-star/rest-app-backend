const express = require('express');
const CategoryImage = require('../models/CategoryImage');

const router = express.Router();

// Public: get category image by category name
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const image = await CategoryImage.getByCategory(category);
    if (!image) {
      return res.status(404).json({ error: 'Category image not found' });
    }
    res.json(image);
  } catch (error) {
    console.error('Get category image error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Public: get all category images
router.get('/', async (req, res) => {
  try {
    const images = await CategoryImage.getAll();
    res.json(images);
  } catch (error) {
    console.error('Get all category images error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

