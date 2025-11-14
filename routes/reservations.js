const express = require('express');
const Reservation = require('../models/Reservation');
const Admin = require('../models/Admin');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get available tables for a specific date and time (no auth required)
router.get('/tables/available', async (req, res) => {
  try {
    const { date, time } = req.query;

    if (!date || !time) {
      return res.status(400).json({ error: 'Date and time are required' });
    }

    const availableTables = await Reservation.getAvailableTables(date, time);
    res.json(availableTables);
  } catch (error) {
    console.error('Get available tables error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create reservation (no auth required, uses mobile number)
router.post('/', async (req, res) => {
  try {
    const { table_id, date, time, number_of_guests, special_requests, mobile_number, email } = req.body;
    // user_id is optional - can be null for guest reservations
    const user_id = null;

    if (!table_id || !date || !time || !number_of_guests || !mobile_number) {
      return res.status(400).json({ error: 'Table, date, time, number of guests, and mobile number are required' });
    }

    // Check if table exists and get capacity
    const table = await Admin.getTableById(table_id);

    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    if (parseInt(number_of_guests) > table.capacity) {
      return res.status(400).json({ error: 'Number of guests exceeds table capacity' });
    }

    // Prevent double booking: verify table is not already confirmed at the same date/time
    const conflict = await Reservation.isTableAlreadyBooked(table_id, date, time);
    if (conflict) {
      return res.status(409).json({ error: 'This table is already booked for the selected date and time' });
    }

    const reservationId = await Reservation.create({
      user_id,
      mobile_number,
      email: email || null,
      table_id,
      date,
      time,
      number_of_guests,
      special_requests
    });

    res.status(201).json({ reservationId, message: 'Reservation created successfully' });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's reservations (requires authentication)
router.get('/my-reservations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const reservations = await Reservation.getByUserId(userId);
    res.json(reservations);
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

