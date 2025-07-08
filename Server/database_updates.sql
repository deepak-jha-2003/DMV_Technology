-- Database schema updates for OAuth support
-- Run these SQL commands in your MySQL database

USE dmv;

-- Add OAuth columns to users table
ALTER TABLE users 
ADD COLUMN google_id VARCHAR(255) NULL UNIQUE,
ADD COLUMN facebook_id VARCHAR(255) NULL UNIQUE,
ADD COLUMN profile_picture VARCHAR(500) NULL;

-- Make password nullable for OAuth users
ALTER TABLE users 
MODIFY COLUMN password VARCHAR(255) NULL;
