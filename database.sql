-- Autronicas Inventory Management System Database Schema
-- For use with XAMPP MySQL/phpMyAdmin

CREATE DATABASE IF NOT EXISTS autronicas_db;
USE autronicas_db;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'mechanic') DEFAULT 'mechanic',
    security_question VARCHAR(255) DEFAULT 'What is your pet''s name?',
    security_answer VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inventory table for product management
CREATE TABLE IF NOT EXISTS inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    min_quantity INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(10, 2) NOT NULL,
    srp_private DECIMAL(10, 2) NOT NULL,
    srp_lgu DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'In Stock',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    company_id INT DEFAULT NULL,
    company_codename VARCHAR(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `inventory`
INSERT INTO `inventory` (`id`, `code`, `description`, `category`, `quantity`, `min_quantity`, `unit_price`, `srp_private`, `srp_lgu`, `status`, `created_at`, `updated_at`, `company_id`, `company_codename`) VALUES
(19, '12121', '1', '', 1, 0, 1.00, 5000.00, 10.00, 'In Stock', '2026-01-16 15:36:31', '2026-01-16 15:38:42', NULL, '1');

-- Sales table for sales/job orders summary
CREATE TABLE IF NOT EXISTS sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_order_no INT UNIQUE NOT NULL,
    date DATE NOT NULL,
    vehicle_plate VARCHAR(50) NOT NULL,
    labor_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    parts_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    srp_total DECIMAL(10, 2) NOT NULL,
    profit DECIMAL(10, 2) NOT NULL DEFAULT 0,
    confirmed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Job orders table for detailed job order information
CREATE TABLE IF NOT EXISTS job_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_order_no INT NOT NULL,
    type ENUM('Private', 'LGU', 'STAN') NOT NULL,
    customer_name VARCHAR(255),
    address TEXT,
    contact_no VARCHAR(50),
    model VARCHAR(100),
    plate_no VARCHAR(50),
    motor_chasis VARCHAR(100),
    time_in VARCHAR(50),
    date DATE NOT NULL,
    date_release DATE,
    vehicle_color VARCHAR(50),
    fuel_level VARCHAR(50),
    engine_number VARCHAR(100),
    assigned_to VARCHAR(255),
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_job_order_no (job_order_no),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Job order services table (relational structure)
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

-- Job order parts table (relational structure)
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

-- Token blacklist table for JWT logout
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

