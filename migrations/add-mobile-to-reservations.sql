-- Add mobile_number and email columns and make user_id nullable for reservations
ALTER TABLE reservations 
ADD COLUMN mobile_number VARCHAR(20) AFTER user_id,
ADD COLUMN email VARCHAR(100) AFTER mobile_number,
MODIFY COLUMN user_id INT NULL;

-- Remove foreign key constraint on user_id since it can be null
ALTER TABLE reservations 
DROP FOREIGN KEY reservations_ibfk_1;

-- Add new foreign key constraint that allows NULL
ALTER TABLE reservations 
ADD CONSTRAINT reservations_ibfk_1 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

