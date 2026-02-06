<?php
// Database configuration for XAMPP
define('DB_HOST', 'localhost');
define('DB_NAME', 'autronicas_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Session configuration
define('SESSION_LIFETIME', 3600); // 1 hour

// Application settings
define('APP_NAME', 'Autronicas Inventory Management System');
define('BASE_URL', 'http://localhost/');

// JWT Secret (change this to a random string)
define('JWT_SECRET', 'feae88e34dd1716e16dd77ba553fa799');
define('JWT_EXPIRATION', 86400); // 24 hours in seconds

// CORS (match your React frontend URL)
define('CORS_ORIGIN', '*');


// Error reporting (set to 0 in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>

