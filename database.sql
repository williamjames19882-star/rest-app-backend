-- Create database
CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tables table
CREATE TABLE IF NOT EXISTS tables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_number VARCHAR(10) NOT NULL UNIQUE,
  capacity INT NOT NULL,
  location VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  table_id INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  number_of_guests INT NOT NULL,
  special_requests TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE
);

-- Contact Requests table
CREATE TABLE IF NOT EXISTS contact_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20) NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample tables
INSERT INTO tables (table_number, capacity, location) VALUES
('T01', 2, 'Window'),
('T02', 2, 'Window'),
('T03', 4, 'Main Hall'),
('T04', 4, 'Main Hall'),
('T05', 4, 'Main Hall'),
('T06', 6, 'Main Hall'),
('T07', 6, 'Main Hall'),
('T08', 8, 'Private Room'),
('T09', 8, 'Private Room'),
('T10', 10, 'Private Room');

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, category, image_url) VALUES
('Margherita Pizza', 'Fresh mozzarella, tomato sauce, basil', 12.99, 'Pizza', '/images/pizza1.jpg'),
('Pepperoni Pizza', 'Mozzarella, pepperoni, tomato sauce', 14.99, 'Pizza', '/images/pizza2.jpg'),
('Caesar Salad', 'Romaine lettuce, parmesan, croutons, caesar dressing', 8.99, 'Salads', '/images/salad1.jpg'),
('Greek Salad', 'Feta cheese, olives, tomatoes, cucumbers', 9.99, 'Salads', '/images/salad2.jpg'),
('Spaghetti Carbonara', 'Bacon, parmesan, black pepper', 15.99, 'Pasta', '/images/pasta1.jpg'),
('Fettuccine Alfredo', 'Cream sauce, parmesan', 14.99, 'Pasta', '/images/pasta2.jpg'),
('Grilled Salmon', 'Fresh salmon with lemon butter sauce', 22.99, 'Main Courses', '/images/salmon1.jpg'),
('Ribeye Steak', 'Prime ribeye with roasted vegetables', 28.99, 'Main Courses', '/images/steak1.jpg'),
('Cheeseburger', 'Beef patty, cheese, lettuce, tomato', 11.99, 'Burgers', '/images/burger1.jpg'),
('Chocolate Cake', 'Rich chocolate cake with frosting', 6.99, 'Desserts', '/images/cake1.jpg'),
('Tiramisu', 'Classic Italian dessert', 7.99, 'Desserts', '/images/tiramisu1.jpg'),
('Chicken Wings', 'Buffalo wings with blue cheese dip', 9.99, 'Appetizers', '/images/wings1.jpg');

-- Banners table for homepage carousel
CREATE TABLE IF NOT EXISTS banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150),
  subtitle VARCHAR(255),
  image_url VARCHAR(255) NOT NULL,
  public_id VARCHAR(255),
  is_active TINYINT(1) DEFAULT 1,
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

