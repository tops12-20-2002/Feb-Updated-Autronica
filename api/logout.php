<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $token = $data['token'] ?? getTokenFromHeader();
    
    if (!$token) {
        sendValidationError('Token is required');
    }
    
    // Validate token to get user info
    $payload = validateToken($token);
    
    // Add token to blacklist
    blacklistToken($token, $payload['user_id'], $payload['exp']);
    
    sendSuccess(null, 'Logged out successfully');
} catch (Exception $e) {
    // Even if token is invalid, we can still return success for logout
    sendSuccess(null, 'Logged out successfully');
}
?>
