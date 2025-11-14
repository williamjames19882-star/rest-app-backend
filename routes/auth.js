const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Auth = require('../models/Auth');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await Auth.login(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const newUser = await Auth.signup({ name, email, password, phone });
    const userId = newUser.id;

    // Generate JWT token with role and name
    const token = jwt.sign(
      { userId, email, name: newUser.name, role: newUser.role },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, userId, role: newUser.role, message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await Auth.login(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role || 'user' },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
      { expiresIn: '7d' }
    );

    res.json({ token, userId: user.id, role: user.role || 'user', message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

