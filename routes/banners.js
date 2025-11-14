const express = require('express');
const Banner = require('../models/Banner');

const router = express.Router();

// Public: get active banners for carousel
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.getActive();
    res.json(banners);
  } catch (error) {
    console.error('Get active banners error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

