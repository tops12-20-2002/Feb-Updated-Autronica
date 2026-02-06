<?php
/**
 * Standardized API Response Helpers
 */

/**
 * Send success response
 */
function sendSuccess($data = null, $message = null, $statusCode = 200) {
    http_response_code($statusCode);
    $response = ['success' => true];
    if ($data !== null) {
        $response['data'] = $data;
    }
    if ($message !== null) {
        $response['message'] = $message;
    }
    echo json_encode($response);
    exit();
}

/**
 * Send error response
 */
function sendError($error, $code = 'ERROR', $statusCode = 400) {
    http_response_code($statusCode);
    
    // In production, don't expose internal error details
    $displayError = $error;
    if (ini_get('display_errors') == 0) {
        // Production mode - show generic messages
        if ($code === 'DATABASE_ERROR') {
            $displayError = 'A database error occurred. Please try again later.';
        } elseif ($code === 'ERROR') {
            $displayError = 'An error occurred. Please try again.';
        }
    }
    
    echo json_encode([
        'success' => false,
        'error' => $displayError,
        'code' => $code
    ]);
    exit();
}

/**
 * Send unauthorized response
 */
function sendUnauthorized($message = 'Unauthorized') {
    sendError($message, 'UNAUTHORIZED', 401);
}

/**
 * Send not found response
 */
function sendNotFound($message = 'Resource not found') {
    sendError($message, 'NOT_FOUND', 404);
}

/**
 * Send validation error response
 */
function sendValidationError($message = 'Validation failed') {
    sendError($message, 'VALIDATION_ERROR', 400);
}
?>

