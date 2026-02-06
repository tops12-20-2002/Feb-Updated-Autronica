<?php
/**
 * JWT Token Handling using firebase/php-jwt
 */

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../config.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/**
 * Generate JWT token for user
 */
function generateToken($userId, $email, $role) {
    $issuedAt = time();
    $expiration = $issuedAt + JWT_EXPIRATION;
    
    $payload = [
        'user_id' => $userId,
        'email' => $email,
        'role' => $role,
        'iat' => $issuedAt,
        'exp' => $expiration
    ];
    
    // Note: encode() accepts string key, decode() requires Key object
    return JWT::encode($payload, JWT_SECRET, 'HS256');
}

/**
 * Validate JWT token and return payload
 */
function validateToken($token) {
    global $pdo;
    
    try {
        // Check if token is blacklisted
        $stmt = $pdo->prepare("SELECT id FROM token_blacklist WHERE token = ? AND expires_at > NOW()");
        $stmt->execute([$token]);
        if ($stmt->fetch()) {
            throw new Exception('Token has been revoked');
        }
        
        // Decode and validate token
        $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
        
        return (array) $decoded;
    } catch (Exception $e) {
        throw new Exception('Invalid token: ' . $e->getMessage());
    }
}

/**
 * Get token from Authorization header
 */
function getTokenFromHeader() {
    $headers = getallheaders();
    
    if (!isset($headers['Authorization']) && !isset($headers['authorization'])) {
        return null;
    }
    
    $authHeader = $headers['Authorization'] ?? $headers['authorization'];
    
    if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        return $matches[1];
    }
    
    return null;
}

/**
 * Add token to blacklist
 */
function blacklistToken($token, $userId, $expiresAt) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("INSERT INTO token_blacklist (token, user_id, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$token, $userId, date('Y-m-d H:i:s', $expiresAt)]);
        return true;
    } catch (PDOException $e) {
        // Token might already be blacklisted, that's okay
        return false;
    }
}
?>

