const express = require('express');
const Reservation = require('../models/Reservation');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get available tables for a specific date and time
router.get('/tables/available', authenticateToken, async (req, res) => {
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

// Create reservation
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { table_id, date, time, number_of_guests, special_requests } = req.body;
    const user_id = req.user.userId;

    if (!table_id || !date || !time || !number_of_guests) {
      return res.status(400).json({ error: 'Table, date, time, and number of guests are required' });
    }

    // Check if table exists and get capacity
    const [tables] = await pool.execute(
      'SELECT * FROM tables WHERE id = ?',
      [table_id]
    );

    if (tables.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    const table = tables[0];

    if (parseInt(number_of_guests) > table.capacity) {
      return res.status(400).json({ error: 'Number of guests exceeds table capacity' });
    }

    const reservationId = await Reservation.create({
      user_id,
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

// Get user's reservations
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

