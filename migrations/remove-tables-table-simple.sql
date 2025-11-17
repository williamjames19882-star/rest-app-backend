-- Simple migration script to remove tables table and update reservations table
-- Run these queries one by one in your MySQL client

USE restaurant_db;

-- Step 1: Find the foreign key constraint name
-- Run this first to see the constraint name:
SELECT CONSTRAINT_NAME 
FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = 'restaurant_db' 
AND TABLE_NAME = 'reservations' 
AND COLUMN_NAME = 'table_id' 
AND REFERENCED_TABLE_NAME = 'tables';

-- Step 2: Drop the foreign key constraint
-- Replace 'reservations_ibfk_2' with the actual constraint name from Step 1
-- Common names: reservations_ibfk_2, fk_table_id, etc.
ALTER TABLE reservations 
DROP FOREIGN KEY reservations_ibfk_2;

-- If you get an error, try these common constraint names:
-- ALTER TABLE reservations DROP FOREIGN KEY fk_table_id;
-- ALTER TABLE reservations DROP FOREIGN KEY reservations_ibfk_1;

-- Step 3: Make table_id nullable
ALTER TABLE reservations 
MODIFY COLUMN table_id INT NULL;

-- Step 4: Set all existing table_id values to NULL (optional)
UPDATE reservations 
SET table_id = NULL 
WHERE table_id IS NOT NULL;

-- Step 5: Drop the tables table
DROP TABLE IF EXISTS tables;

-- Verification queries (optional):
-- Check that table_id is now nullable
SELECT COLUMN_NAME, IS_NULLABLE, DATA_TYPE 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'restaurant_db' 
AND TABLE_NAME = 'reservations' 
AND COLUMN_NAME = 'table_id';

-- Check that tables table is removed (should return empty)
SHOW TABLES LIKE 'tables';

