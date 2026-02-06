<?php
/**
 * Authentication Middleware
 * Use this to protect API endpoints
 */

require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/response.php';

/**
 * Require authentication - validates JWT token
 * Returns user data from token on success
 */
function requireAuth() {
    $token = getTokenFromHeader();
    
    if (!$token) {
        sendUnauthorized('No token provided');
    }
    
    try {
        $payload = validateToken($token);
        return $payload;
    } catch (Exception $e) {
        sendUnauthorized($e->getMessage());
    }
}

/**
 * Optional authentication - returns user data if token is valid, null otherwise
 */
function optionalAuth() {
    $token = getTokenFromHeader();
    
    if (!$token) {
        return null;
    }
    
    try {
        return validateToken($token);
    } catch (Exception $e) {
        return null;
    }
}
?>

