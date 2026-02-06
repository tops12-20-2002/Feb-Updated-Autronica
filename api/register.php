<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $fullName = trim($data['full_name'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $role = trim($data['role'] ?? 'mechanic'); // Default to mechanic if not provided
    $securityQuestion = trim($data['security_question'] ?? '');
    $securityAnswer = trim($data['security_answer'] ?? '');

    if (empty($fullName) || empty($email) || empty($password) || empty($securityQuestion) || empty($securityAnswer)) {
        sendValidationError('All fields are required, including security question');
    }

    // Validate role
    if (!in_array($role, ['admin', 'mechanic'])) {
        sendValidationError('Invalid role. Must be admin or mechanic');
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendValidationError('Invalid email format');
    }

    // Validate password length
    if (strlen($password) < 8) {
        sendValidationError('Password must be at least 8 characters');
    }

    // Check if email already exists using prepared statement
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendError('Email already exists', 'EMAIL_EXISTS', 409);
    }
    
    // Generate username from email (part before @)
    $username = explode('@', $email)[0];
    // Ensure username is unique by appending numbers if needed
    $originalUsername = $username;
    $counter = 1;
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    while (true) {
        $stmt->execute([$username]);
        if (!$stmt->fetch()) {
            break; // Username is available
        }
        $username = $originalUsername . $counter;
        $counter++;
    }
    
    // Create new user with prepared statement
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $hashedAnswer = password_hash(strtolower($securityAnswer), PASSWORD_DEFAULT); // Hash answer, case-insensitive check later
    $stmt = $pdo->prepare("INSERT INTO users (username, email, full_name, password, role, security_question, security_answer) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$username, $email, $fullName, $hashedPassword, $role, $securityQuestion, $hashedAnswer]);
    
    $userId = $pdo->lastInsertId();
    
    // Generate JWT token
    $token = generateToken($userId, $email, $role);
    
    // Get created user
    $stmt = $pdo->prepare("SELECT id, email, full_name, role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    
    sendSuccess([
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'full_name' => $user['full_name'],
            'role' => $user['role']
        ]
    ], 'Registration successful');
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 'DATABASE_ERROR', 500);
} catch (Exception $e) {
    sendError($e->getMessage(), 'ERROR', 500);
}
?>
