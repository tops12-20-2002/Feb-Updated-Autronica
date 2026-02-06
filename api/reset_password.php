<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = trim($data['email'] ?? '');
    $securityAnswer = trim($data['security_answer'] ?? '');
    $newPassword = $data['new_password'] ?? '';

    if (empty($email)) {
        sendValidationError('Email is required');
    }

    // Check if user exists
    $stmt = $pdo->prepare("SELECT id, security_question, security_answer FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        sendError('User not found', 'USER_NOT_FOUND', 404);
    }

    // Stage 1: Fetch Security Question
    if (empty($securityAnswer) && empty($newPassword)) {
        if (empty($user['security_question'])) {
             sendError('No security question set for this account. Please contact admin.', 'NO_SECURITY_QUESTION', 400);
        }
        sendSuccess(['security_question' => $user['security_question']], 'Security question retrieved');
        exit;
    }

    // Stage 2: Verify Answer and Reset Password
    if (empty($securityAnswer) || empty($newPassword)) {
        sendValidationError('Security answer and new password are required');
    }
    
    // Check answer (case-insensitive)
    if (!password_verify(strtolower($securityAnswer), $user['security_answer'])) {
        sendError('Incorrect security answer', 'INVALID_ANSWER', 401);
    }

    if (strlen($newPassword) < 8) {
         sendValidationError('Password must be at least 8 characters');
    }

    // Update password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
    $stmt->execute([$hashedPassword, $user['id']]);

    sendSuccess(null, 'Password has been reset successfully');

} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 'DATABASE_ERROR', 500);
} catch (Exception $e) {
    sendError($e->getMessage(), 'ERROR', 500);
}
?>
