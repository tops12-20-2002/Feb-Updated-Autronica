-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 06, 2026 at 04:39 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `autronicas_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `part_number` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `min_quantity` int(11) NOT NULL DEFAULT 0,
  `unit_price` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'In Stock',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `company_id` int(11) DEFAULT NULL,
  `company_codename` varchar(50) DEFAULT NULL,
  `srp_private` decimal(10,2) NOT NULL DEFAULT 0.00,
  `srp_lgu` decimal(10,2) NOT NULL DEFAULT 0.00,
  `srp_stan` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `code`, `part_number`, `description`, `category`, `quantity`, `min_quantity`, `unit_price`, `status`, `created_at`, `updated_at`, `company_id`, `company_codename`, `srp_private`, `srp_lgu`, `srp_stan`) VALUES
(27, '12', '12', '12', '', 14, 0, 20.00, 'In Stock', '2026-02-06 19:11:02', '2026-02-06 22:01:54', NULL, '12', 12.60, 5.60, 11.60),
(28, '123', '1', 'Door', 'General', 12, 0, 22.00, 'In Stock', '2026-02-06 22:13:13', '2026-02-06 22:13:13', NULL, 'Autronica', 30.80, 39.42, 32.03);

-- --------------------------------------------------------

--
-- Table structure for table `job_orders`
--

CREATE TABLE `job_orders` (
  `id` int(11) NOT NULL,
  `job_order_no` int(11) NOT NULL,
  `type` enum('Private','LGU','STAN') NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `contact_no` varchar(50) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `plate_no` varchar(50) DEFAULT NULL,
  `motor_chasis` varchar(100) DEFAULT NULL,
  `time_in` varchar(50) DEFAULT NULL,
  `date` date NOT NULL,
  `date_release` date DEFAULT NULL,
  `vehicle_color` varchar(50) DEFAULT NULL,
  `fuel_level` varchar(50) DEFAULT NULL,
  `engine_number` varchar(100) DEFAULT NULL,
  `assigned_to` varchar(255) DEFAULT NULL,
  `status` enum('Pending','In Progress','Completed') DEFAULT 'Pending',
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_orders`
--

INSERT INTO `job_orders` (`id`, `job_order_no`, `type`, `customer_name`, `address`, `contact_no`, `model`, `plate_no`, `motor_chasis`, `time_in`, `date`, `date_release`, `vehicle_color`, `fuel_level`, `engine_number`, `assigned_to`, `status`, `subtotal`, `discount`, `total_amount`, `created_at`, `updated_at`) VALUES
(38, 0, 'Private', '1', '1', '1', '1', '1', NULL, NULL, '2026-02-06', '2026-02-24', NULL, NULL, NULL, 'Technician B', 'In Progress', 500.00, 45.00, 455.00, '2026-02-06 22:43:22', '2026-02-06 22:43:22');

-- --------------------------------------------------------

--
-- Table structure for table `job_order_parts`
--

CREATE TABLE `job_order_parts` (
  `id` int(11) NOT NULL,
  `job_order_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_order_services`
--

CREATE TABLE `job_order_services` (
  `id` int(11) NOT NULL,
  `job_order_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_order_services`
--

INSERT INTO `job_order_services` (`id`, `job_order_id`, `description`, `quantity`, `unit`, `price`, `total`, `created_at`) VALUES
(72, 38, '1', 1, '1', 500.00, 500.00, '2026-02-06 22:43:22');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `job_order_no` int(11) NOT NULL,
  `date` date NOT NULL,
  `vehicle_plate` varchar(50) NOT NULL,
  `labor_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `parts_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `unit_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `srp_total` decimal(10,2) NOT NULL,
  `profit` decimal(10,2) NOT NULL DEFAULT 0.00,
  `confirmed` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `token_blacklist`
--

CREATE TABLE `token_blacklist` (
  `id` int(11) NOT NULL,
  `token` varchar(500) NOT NULL,
  `user_id` int(11) NOT NULL,
  `expires_at` datetime NOT NULL,
  `blacklisted_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `token_blacklist`
--

INSERT INTO `token_blacklist` (`id`, `token`, `user_id`, `expires_at`, `blacklisted_at`) VALUES
(3, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJlbWFpbCI6IjEyMzRAZ21haWwuY29tIiwicm9sZSI6Im1lY2hhbmljIiwiaWF0IjoxNzcwMDQwODY1LCJleHAiOjE3NzAxMjcyNjV9.8iPDksuTi62q5K47OJUzgTwgZT8Lh5BntrayTq1PeIU', 4, '2026-02-03 15:01:05', '2026-02-02 22:09:34'),
(4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJlbWFpbCI6IjEyMzRAZ21haWwuY29tIiwicm9sZSI6Im1lY2hhbmljIiwiaWF0IjoxNzcwMDQxNDEyLCJleHAiOjE3NzAxMjc4MTJ9.n_NEdNoXDVDBEpWy2qTHE0SjFd6ZIBo9OqF0Bss_WGA', 4, '2026-02-03 15:10:12', '2026-02-02 22:10:31'),
(5, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJlbWFpbCI6IjEyMzRAZ21haWwuY29tIiwicm9sZSI6Im1lY2hhbmljIiwiaWF0IjoxNzcwMzc0NzUzLCJleHAiOjE3NzA0NjExNTN9.cvHktJk3tmuVWMSDf7rJA-QsZFfYhS-GVD21ej2iQUA', 4, '2026-02-07 11:45:53', '2026-02-06 23:18:11'),
(6, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJlbWFpbCI6IjEyMzRAZ21haWwuY29tIiwicm9sZSI6Im1lY2hhbmljIiwiaWF0IjoxNzcwMzkxMTAxLCJleHAiOjE3NzA0Nzc1MDF9.XAdq8uuWJrwOnTu9BtZOqsQYn2AhFJ2H0xf8kL9hsUg', 4, '2026-02-07 16:18:21', '2026-02-06 23:33:01'),
(7, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJlbWFpbCI6IjEyMzRAZ21haWwuY29tIiwicm9sZSI6Im1lY2hhbmljIiwiaWF0IjoxNzcwMzkxOTk0LCJleHAiOjE3NzA0NzgzOTR9.eOyWFX681N7EIHy1awKcVTPg_GKwGEtFKqG22lFviaI', 4, '2026-02-07 16:33:14', '2026-02-06 23:33:27');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','mechanic') DEFAULT 'mechanic',
  `security_question` varchar(255) DEFAULT 'What is your pet''s name?',
  `security_answer` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `full_name`, `password`, `role`, `security_question`, `security_answer`, `created_at`) VALUES
(3, 'christopherzarsuelo028', 'christopherzarsuelo028@gmail.com', 'Christopher Zarsuelo', '$2y$10$rsClnzuYSJgU5tMQC/4PnulTaOuk/JxxGsS5mWDhHdmkD0nGeYRq6', 'mechanic', 'What is your pet\'s name?', '$2y$10$3Wlfrh.WSInsnTiFiAzmFum6R8/r.PerZDKtMppO19i7mKRgru./S', '2026-01-13 21:19:20'),
(4, '1234', '1234@gmail.com', 'topher', '$2y$10$JIaT/2lYCghb2WRPj7BKqeMjVm5xWkLUhgoLU6nrZtyVkoODtVPPO', 'mechanic', 'What is your pet\'s name?', '$2y$10$VQBI.SX3LEpURB./bNxZZOZRZara388I8ddeAJ7aN681Th0u3PPGC', '2026-02-02 22:00:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `job_orders`
--
ALTER TABLE `job_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_job_order_no` (`job_order_no`),
  ADD KEY `idx_date` (`date`);

--
-- Indexes for table `job_order_parts`
--
ALTER TABLE `job_order_parts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_job_order_id` (`job_order_id`);

--
-- Indexes for table `job_order_services`
--
ALTER TABLE `job_order_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_job_order_id` (`job_order_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `job_order_no` (`job_order_no`);

--
-- Indexes for table `token_blacklist`
--
ALTER TABLE `token_blacklist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_expires_at` (`expires_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `job_orders`
--
ALTER TABLE `job_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `job_order_parts`
--
ALTER TABLE `job_order_parts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `job_order_services`
--
ALTER TABLE `job_order_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `token_blacklist`
--
ALTER TABLE `token_blacklist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `job_order_parts`
--
ALTER TABLE `job_order_parts`
  ADD CONSTRAINT `job_order_parts_ibfk_1` FOREIGN KEY (`job_order_id`) REFERENCES `job_orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_order_services`
--
ALTER TABLE `job_order_services`
  ADD CONSTRAINT `job_order_services_ibfk_1` FOREIGN KEY (`job_order_id`) REFERENCES `job_orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `token_blacklist`
--
ALTER TABLE `token_blacklist`
  ADD CONSTRAINT `token_blacklist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
