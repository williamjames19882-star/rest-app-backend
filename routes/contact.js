const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// Create contact request
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO contact_requests (name, phone, email, message) VALUES (?, ?, ?, ?)',
      [name, phone, email || null, message || null]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Contact request submitted successfully' 
    });
  } catch (error) {
    console.error('Create contact request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

