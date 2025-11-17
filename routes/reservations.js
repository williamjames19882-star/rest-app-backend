const express = require('express');
const Reservation = require('../models/Reservation');
const Admin = require('../models/Admin');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { isWithinOpeningHours, getOpeningHoursMessage } = require('../utils/openingHours');

const router = express.Router();

// Create reservation (no auth required, uses mobile number)
router.post('/', async (req, res) => {
  try {
    const { date, time, number_of_guests, special_requests, mobile_number, email } = req.body;
    // user_id is optional - can be null for guest reservations
    const user_id = null;

    if (!date || !time || !number_of_guests || !mobile_number) {
      return res.status(400).json({ error: 'Date, time, number of guests, and mobile number are required' });
    }

    const guests = parseInt(number_of_guests);
    if (isNaN(guests) || guests < 1) {
      return res.status(400).json({ error: 'Number of guests must be at least 1' });
    }

    // Validate time is within opening hours
    if (!isWithinOpeningHours(date, time)) {
      const hoursMessage = getOpeningHoursMessage(date);
      return res.status(400).json({ 
        error: `Booking time must be within opening hours. ${hoursMessage}` 
      });
    }

    const reservationId = await Reservation.create({
      user_id,
      mobile_number,
      email: email || null,
      table_id: null,
      date,
      time,
      number_of_guests: guests,
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

