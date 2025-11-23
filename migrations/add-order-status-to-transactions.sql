-- Add order_status column to transactions table
ALTER TABLE transactions 
ADD COLUMN order_status VARCHAR(50) DEFAULT 'order_accepted' AFTER status;

