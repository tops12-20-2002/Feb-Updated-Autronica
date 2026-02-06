-- Autronicas Inventory Management System Database Migration
-- Run this script on existing databases to update the schema
-- For use with XAMPP MySQL/phpMyAdmin

USE autronicas_db;

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE AFTER username,
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255) AFTER email,
ADD COLUMN IF NOT EXISTS role ENUM('admin', 'mechanic') DEFAULT 'mechanic' AFTER full_name,
ADD COLUMN IF NOT EXISTS security_question VARCHAR(255) DEFAULT 'What is your pet''s name?' AFTER role,
ADD COLUMN IF NOT EXISTS security_answer VARCHAR(255) AFTER security_question;

-- Update existing users: set email = username if email is NULL
UPDATE users SET email = username WHERE email IS NULL OR email = '';

-- Make email NOT NULL after setting values
ALTER TABLE users MODIFY email VARCHAR(255) NOT NULL;

-- Add status column to inventory table
ALTER TABLE inventory 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'In Stock' AFTER srp_lgu;

-- Update inventory status based on quantity
UPDATE inventory SET status = 'Low Stock' WHERE quantity <= min_quantity AND quantity > 0;
UPDATE inventory SET status = 'Out of Stock' WHERE quantity = 0;

-- Update job_orders table
ALTER TABLE job_orders 
MODIFY COLUMN type ENUM('Private', 'LGU', 'STAN') NOT NULL,
ADD COLUMN IF NOT EXISTS date_release DATE AFTER date,
ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(255) AFTER engine_number,
ADD COLUMN IF NOT EXISTS status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending' AFTER assigned_to,
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER status,
ADD COLUMN IF NOT EXISTS discount DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER subtotal;

-- Drop old TEXT columns if they exist (after migrating data if needed)
-- Note: If you have existing data in labor_data and parts_data, you'll need to migrate it first
-- ALTER TABLE job_orders DROP COLUMN IF EXISTS labor_data;
-- ALTER TABLE job_orders DROP COLUMN IF EXISTS parts_data;

-- Create job_order_services table
CREATE TABLE IF NOT EXISTS job_order_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_order_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_order_id) REFERENCES job_orders(id) ON DELETE CASCADE,
    INDEX idx_job_order_id (job_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create job_order_parts table
CREATE TABLE IF NOT EXISTS job_order_parts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_order_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_order_id) REFERENCES job_orders(id) ON DELETE CASCADE,
    INDEX idx_job_order_id (job_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create token_blacklist table
CREATE TABLE IF NOT EXISTS token_blacklist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(500) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    expires_at DATETIME NOT NULL,
    blacklisted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

