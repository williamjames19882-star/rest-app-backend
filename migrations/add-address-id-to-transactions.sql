-- Add address_id column to transactions table
ALTER TABLE transactions 
ADD COLUMN address_id INT NULL AFTER order_type,
ADD FOREIGN KEY (address_id) REFERENCES user_addresses(id) ON DELETE SET NULL;

