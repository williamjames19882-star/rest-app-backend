-- Migration script to remove tables table and update reservations table
-- Run this script to update your existing database

USE restaurant_db;

-- Step 1: Find and drop the foreign key constraint on table_id in reservations table
-- This query finds the constraint name dynamically
SET @constraint_name = (
  SELECT CONSTRAINT_NAME 
  FROM information_schema.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = 'restaurant_db' 
  AND TABLE_NAME = 'reservations' 
  AND COLUMN_NAME = 'table_id' 
  AND REFERENCED_TABLE_NAME = 'tables'
  LIMIT 1
);

-- Drop the foreign key constraint if it exists
SET @sql = IF(@constraint_name IS NOT NULL, 
  CONCAT('ALTER TABLE reservations DROP FOREIGN KEY ', @constraint_name), 
  'SELECT "No foreign key constraint found" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 2: Make table_id nullable in reservations table (if not already)
ALTER TABLE reservations 
MODIFY COLUMN table_id INT NULL;

-- Step 3: Set all existing table_id values to NULL (optional, but recommended)
UPDATE reservations 
SET table_id = NULL 
WHERE table_id IS NOT NULL;

-- Step 4: Drop the tables table
DROP TABLE IF EXISTS tables;

-- Step 5: Verify the changes
-- Check that table_id is now nullable
SELECT COLUMN_NAME, IS_NULLABLE, DATA_TYPE 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'restaurant_db' 
AND TABLE_NAME = 'reservations' 
AND COLUMN_NAME = 'table_id';

-- Check that tables table is removed (should return empty)
SHOW TABLES LIKE 'tables';

