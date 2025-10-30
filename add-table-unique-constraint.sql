-- Add UNIQUE constraint to table_number column in tables table
-- This prevents duplicate table numbers

USE restaurant_db;

ALTER TABLE tables 
ADD CONSTRAINT unique_table_number UNIQUE (table_number);

-- If the constraint already exists, this will show an error, which is fine
-- The constraint will prevent duplicate table numbers from being inserted

-- Prevent double bookings: ensure only one reservation per table for a date+time
-- Note: This enforces uniqueness across all statuses; app updates status instead of inserting duplicates
-- If previously added, drop unique constraint to allow pending duplicates; app enforces on confirmation
ALTER TABLE reservations 
DROP INDEX unique_table_datetime;

