-- Add order_type column to transactions table
ALTER TABLE transactions 
ADD COLUMN order_type VARCHAR(20) DEFAULT 'collection' AFTER notes;

