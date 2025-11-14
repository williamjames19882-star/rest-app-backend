const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

// Create contact request
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const id = await Contact.createRequest({
      name,
      phone,
      email,
      message
    });

    res.status(201).json({ 
      id, 
      message: 'Contact request submitted successfully' 
    });
  } catch (error) {
    console.error('Create contact request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

