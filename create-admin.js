const bcrypt = require('bcryptjs');
const pool = require('./config/db');
require('dotenv').config();

async function createAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@restaurant.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Check if admin already exists
    const [existing] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [adminEmail]
    );
    
    if (existing.length > 0) {
      // Update existing user to admin
      await pool.execute(
        'UPDATE users SET role = ?, password = ? WHERE email = ?',
        ['admin', hashedPassword, adminEmail]
      );
      console.log('Admin user updated successfully!');
    } else {
      // Create new admin user
      await pool.execute(
        'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
        ['Admin User', adminEmail, hashedPassword, '0000000000', 'admin']
      );
      console.log('Admin user created successfully!');
    }
    
    console.log(`\nAdmin Credentials:
    Email: ${adminEmail}
    Password: ${adminPassword}
    \n⚠️  CHANGE THE PASSWORD IMMEDIATELY in production!
    `);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();

