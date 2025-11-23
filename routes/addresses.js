const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const { authenticateToken } = require('../middleware/auth');

// Get all addresses for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;
    const addresses = await Address.getByUserId(user_id);
    res.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// Get a specific address by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;
    
    const address = await Address.getById(id, user_id);
    
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    
    res.json(address);
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({ error: 'Failed to fetch address' });
  }
});

// Create a new address
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { address_line1, address_line2, city, postal_code, country, is_default } = req.body;
    const user_id = req.user.userId;

    if (!address_line1 || !city || !postal_code) {
      return res.status(400).json({ error: 'Address line 1, city, and postal code are required' });
    }

    const addressId = await Address.create({
      user_id,
      address_line1,
      address_line2,
      city,
      postal_code,
      country: country || 'UK',
      is_default: is_default || false
    });

    const newAddress = await Address.getById(addressId, user_id);
    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: 'Failed to create address' });
  }
});

// Update an address
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { address_line1, address_line2, city, postal_code, country, is_default } = req.body;
    const user_id = req.user.userId;

    if (!address_line1 || !city || !postal_code) {
      return res.status(400).json({ error: 'Address line 1, city, and postal code are required' });
    }

    const updated = await Address.update(id, user_id, {
      address_line1,
      address_line2,
      city,
      postal_code,
      country: country || 'UK',
      is_default: is_default || false
    });

    if (!updated) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const updatedAddress = await Address.getById(id, user_id);
    res.json(updatedAddress);
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
});

// Delete an address
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;

    const deleted = await Address.delete(id, user_id);

    if (!deleted) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

// Set an address as default
router.patch('/:id/set-default', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;

    const updated = await Address.setDefault(id, user_id);

    if (!updated) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({ message: 'Address set as default successfully' });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({ error: 'Failed to set default address' });
  }
});

module.exports = router;

