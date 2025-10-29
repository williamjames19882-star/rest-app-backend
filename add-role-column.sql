-- Add role column to existing users table
-- Run this if you already have the database without the role column

ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';

-- Create a default admin user
-- Password: admin123 (change this!)
INSERT INTO users (name, email, password, phone, role)
VALUES (
  'Admin User',
  'admin@restaurant.com',
  '$2a$10$K8Z8Q0x5xNZ0xNZ0xNZ0x.YQZx.YQZx.YQZx.YQZx.YQZx.YQZxYQZx',
  '1234567890',
  'admin'
);

-- Update existing admin user (replace with actual email)
-- This is a hashed version of "admin123" - change the password!
UPDATE users 
SET role = 'admin', 
    password = '$2a$10$XvZy/fcNca2gA3cgaybGoO7J6IStXymzVLy3CexRZm/5iUkj7JANG '
WHERE email = 'admin@restaurant.com';

