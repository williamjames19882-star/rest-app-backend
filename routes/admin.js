const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Admin = require('../models/Admin');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../utils/uploadHelper');
const Banner = require('../models/Banner');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Get all users with optional search and pagination
router.get('/users', async (req, res) => {
  try {
    const { search, page, pageSize } = req.query;
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 25;
    const result = await Admin.getAllUsers(search, pageNum, pageSizeNum);
    res.json(result);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all reservations (admin only)
router.get('/reservations', async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 25;
    const reservations = await Admin.getAllReservations(pageNum, pageSizeNum);
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

    const item = await Admin.createMenuItem({
      name,
      description,
      price,
      category,
      image_url
    });

    res.status(201).json({ 
      id: item.id, 
      item,
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
    const currentImageUrl = await Admin.getMenuItemImageUrl(id);

    if (!currentImageUrl && !body_image_url) {
      const existingItem = await Admin.getMenuItemById(id);
      if (!existingItem) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
    }

    let image_url = currentImageUrl || null; // Default to current image

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

    const item = await Admin.updateMenuItem(id, {
      name,
      description,
      price,
      category,
      image_url
    });

    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ item, message: 'Menu item updated successfully' });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete menu item
router.delete('/menu/items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const affectedRows = await Admin.deleteMenuItem(id);

    if (affectedRows === 0) {
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


    const affectedRows = await Admin.updateReservationStatus(id, status);

    if (affectedRows === 0) {
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
    const stats = await Admin.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all contact requests
router.get('/contact-requests', async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 25;
    const requests = await Admin.getAllContactRequests(pageNum, pageSizeNum);
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

    const affectedRows = await Admin.updateContactRequestStatus(id, status);

    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Contact request not found' });
    }

    res.json({ message: 'Contact request status updated successfully' });
  } catch (error) {
    console.error('Update contact request status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Banners management
// Get all banners (including inactive)
router.get('/banners', async (req, res) => {
  try {
    const banners = await Banner.getAll();
    res.json(banners);
  } catch (error) {
    console.error('Get all banners error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create banner (with image upload)
router.post('/banners', upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, is_active, position } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const result = await uploadToCloudinary(req.file, 'banners');

    const banner = await Banner.create({
      title,
      subtitle,
      image_url: result.secure_url,
      public_id: result.public_id,
      is_active: is_active === '0' ? 0 : 1,
      position: position ? parseInt(position, 10) : 0
    });

    res.status(201).json({ banner, message: 'Banner created successfully' });
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update banner (optionally replace image)
router.put('/banners/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, is_active, position } = req.body;

    const existing = await Banner.getById(id);
    if (!existing) return res.status(404).json({ error: 'Banner not found' });

    let image_url = existing.image_url;
    let public_id = existing.public_id;

    if (req.file) {
      // Optionally delete old image
      if (public_id) {
        try { await deleteFromCloudinary(public_id); } catch (e) { /* ignore */ }
      }
      const uploadRes = await uploadToCloudinary(req.file, 'banners');
      image_url = uploadRes.secure_url;
      public_id = uploadRes.public_id;
    }

    const updated = await Banner.update(id, {
      title,
      subtitle,
      image_url,
      public_id,
      is_active: is_active === '0' ? 0 : 1,
      position: position ? parseInt(position, 10) : 0
    });

    res.json({ banner: updated, message: 'Banner updated successfully' });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete banner
router.delete('/banners/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Banner.getById(id);
    if (!existing) return res.status(404).json({ error: 'Banner not found' });

    if (existing.public_id) {
      try { await deleteFromCloudinary(existing.public_id); } catch (e) { /* ignore */ }
    }

    await Banner.delete(id);
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Transactions management
const Transaction = require('../models/Transaction');

// Get all transactions or search by username, order_number, or transaction_id
router.get('/transactions', async (req, res) => {
  try {
    const { username, order_number, transaction_id, page, pageSize } = req.query;
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 25;
    
    let transactions;
    if (username || order_number || transaction_id) {
      transactions = await Transaction.search({ 
        username, 
        order_number, 
        transaction_id, 
        page: pageNum, 
        pageSize: pageSizeNum 
      });
    } else {
      transactions = await Transaction.getAll(pageNum, pageSizeNum);
    }
    
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update transaction status
router.put('/transactions/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const affectedRows = await Transaction.updateStatus(id, status);

    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction status updated successfully' });
  } catch (error) {
    console.error('Update transaction status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status
router.put('/transactions/:id/order-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    if (!['order_accepted', 'order_preparing', 'order_ready', 'order_delivered'].includes(order_status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const affectedRows = await Transaction.updateOrderStatus(id, order_status);

    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

