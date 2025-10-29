const express = require('express');
const Menu = require('../models/Menu');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all menu items
router.get('/items', async (req, res) => {
  try {
    const { category } = req.query;
    
    let items;
    if (category) {
      items = await Menu.getByCategory(category);
    } else {
      items = await Menu.getAll();
    }
    
    res.json(items);
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single menu item
router.get('/items/:id', async (req, res) => {
  try {
    const item = await Menu.getById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const items = await Menu.getAll();
    const categories = [...new Set(items.map(item => item.category))];
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

