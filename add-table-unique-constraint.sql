-- Add UNIQUE constraint to table_number column in tables table
-- This prevents duplicate table numbers

USE restaurant_db;

ALTER TABLE tables 
ADD CONSTRAINT unique_table_number UNIQUE (table_number);

-- If the constraint already exists, this will show an error, which is fine
-- The constraint will prevent duplicate table numbers from being inserted

