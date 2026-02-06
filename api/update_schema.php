<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';

try {
    echo "Updating users table...\n";
    
    // Check if columns exist first to avoid errors
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'security_question'");
    if ($stmt->fetch()) {
        echo "Column 'security_question' already exists.\n";
    } else {
        $pdo->exec("ALTER TABLE users ADD COLUMN security_question VARCHAR(255) DEFAULT 'What is your pet''s name?' AFTER role");
        echo "Added 'security_question' column.\n";
    }

    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'security_answer'");
    if ($stmt->fetch()) {
        echo "Column 'security_answer' already exists.\n";
    } else {
        $pdo->exec("ALTER TABLE users ADD COLUMN security_answer VARCHAR(255) AFTER security_question");
        echo "Added 'security_answer' column.\n";
    }

    echo "Database schema update completed successfully.\n";
} catch (PDOException $e) {
    echo "Error updating database: " . $e->getMessage() . "\n";
}
?>
