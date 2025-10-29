const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const pool = require('../config/db');
const { upload, uploadToCloudinary } = require('../utils/uploadHelper');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Get all users with optional search
router.get('/users', async (req, res) => {
  try {
    const { search } = req.query;
    
    if (search) {
      // Search users by name or email
      const [users] = await pool.execute(
        `SELECT id, name, email, phone, role, created_at 
         FROM users 
         WHERE name LIKE ? OR email LIKE ? 
         ORDER BY created_at DESC`,
        [`%${search}%`, `%${search}%`]
      );
      res.json(users);
    } else {
      // Get all users
      const users = await User.findAll();
      res.json(users);
    }
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all reservations (admin only)
router.get('/reservations', async (req, res) => {
  try {
    const [reservations] = await pool.execute(
      `SELECT r.*, u.name as user_name, u.email, u.phone, t.table_number, t.capacity, t.location 
       FROM reservations r 
       JOIN users u ON r.user_id = u.id 
       JOIN tables t ON r.table_id = t.id 
       ORDER BY r.date DESC, r.time DESC`
    );
    res.json(reservations);
  } catch (error) {
    console.error('Get all reservations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create menu item with optional image upload
router.post('/menu/items', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    let image_url = req.body.image_url || null;

    // If image file is uploaded, upload to Cloudinary
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file, 'menu');
        image_url = result.secure_url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image' });
      }
    }

    const [result] = await pool.execute(
      'INSERT INTO menu_items (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, category, image_url]
    );

    // Fetch created item
    const [item] = await pool.execute(
      'SELECT * FROM menu_items WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ 
      id: result.insertId, 
      item: item[0],
      message: 'Menu item created successfully' 
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update menu item with optional image upload
router.put('/menu/items/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url: body_image_url } = req.body;

    // Fetch current item to get existing image_url
    const [currentItem] = await pool.execute(
      'SELECT image_url FROM menu_items WHERE id = ?',
      [id]
    );

    if (currentItem.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    let image_url = currentItem[0].image_url; // Default to current image

    // If new image file is uploaded, upload to Cloudinary
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file, 'menu');
        image_url = result.secure_url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image' });
      }
    } else if (body_image_url !== undefined && body_image_url !== '') {
      // If image_url is explicitly provided in body (keeping existing image)
      image_url = body_image_url;
    }

    const [result] = await pool.execute(
      'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, image_url = ? WHERE id = ?',
      [name, description, price, category, image_url, id]
    );

    // Fetch updated item
    const [item] = await pool.execute(
      'SELECT * FROM menu_items WHERE id = ?',
      [id]
    );

    res.json({ item: item[0], message: 'Menu item updated successfully' });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete menu item
router.delete('/menu/items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM menu_items WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update reservation status
router.put('/reservations/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['confirmed', 'cancelled', 'pending', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [result] = await pool.execute(
      'UPDATE reservations SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.json({ message: 'Reservation status updated successfully' });
  } catch (error) {
    console.error('Update reservation status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get statistics
router.get('/stats', async (req, res) => {
  try {
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [reservationCount] = await pool.execute('SELECT COUNT(*) as count FROM reservations');
    const [menuItemCount] = await pool.execute('SELECT COUNT(*) as count FROM menu_items');

    res.json({
      users: userCount[0].count,
      reservations: reservationCount[0].count,
      menuItems: menuItemCount[0].count,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all tables
router.get('/tables', async (req, res) => {
  try {
    const [tables] = await pool.execute(
      'SELECT * FROM tables ORDER BY table_number ASC'
    );
    res.json(tables);
  } catch (error) {
    console.error('Get all tables error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new table
router.post('/tables', async (req, res) => {
  try {
    const { table_number, capacity, location } = req.body;

    if (!table_number || !capacity) {
      return res.status(400).json({ error: 'Table number and capacity are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO tables (table_number, capacity, location) VALUES (?, ?, ?)',
      [table_number, capacity, location || '']
    );

    const [table] = await pool.execute(
      'SELECT * FROM tables WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ table: table[0], message: 'Table created successfully' });
  } catch (error) {
    console.error('Create table error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Table number already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Update table
router.put('/tables/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { table_number, capacity, location } = req.body;

    if (!table_number || !capacity) {
      return res.status(400).json({ error: 'Table number and capacity are required' });
    }

    const [result] = await pool.execute(
      'UPDATE tables SET table_number = ?, capacity = ?, location = ? WHERE id = ?',
      [table_number, capacity, location || '', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    const [table] = await pool.execute(
      'SELECT * FROM tables WHERE id = ?',
      [id]
    );

    res.json({ table: table[0], message: 'Table updated successfully' });
  } catch (error) {
    console.error('Update table error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Table number already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Delete table
router.delete('/tables/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if table has reservations
    const [reservations] = await pool.execute(
      'SELECT COUNT(*) as count FROM reservations WHERE table_id = ?',
      [id]
    );

    if (reservations[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete table with existing reservations' });
    }

    const [result] = await pool.execute(
      'DELETE FROM tables WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Delete table error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all contact requests
router.get('/contact-requests', async (req, res) => {
  try {
    const [requests] = await pool.execute(
      'SELECT * FROM contact_requests ORDER BY created_at DESC'
    );
    res.json(requests);
  } catch (error) {
    console.error('Get all contact requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update contact request status
router.put('/contact-requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'responded'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [result] = await pool.execute(
      'UPDATE contact_requests SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact request not found' });
    }

    res.json({ message: 'Contact request status updated successfully' });
  } catch (error) {
    console.error('Update contact request status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

