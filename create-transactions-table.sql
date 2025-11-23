-- Transactions/Orders table
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  items JSON NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  notes TEXT NULL,
  order_type VARCHAR(20) DEFAULT 'collection',
  address_id INT NULL,
  status VARCHAR(20) DEFAULT 'completed',
  order_status VARCHAR(50) DEFAULT 'order_accepted',
  FOREIGN KEY (address_id) REFERENCES user_addresses(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_order_number (order_number),
  INDEX idx_created_at (created_at)
);

