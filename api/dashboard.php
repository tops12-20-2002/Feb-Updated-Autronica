<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/middleware.php';
require_once __DIR__ . '/response.php';

// Require authentication
requireAuth();

try {
    // Get total products count
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM inventory");
    $totalProducts = intval($stmt->fetch()['total']);
    
    // Get total job orders count
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM job_orders");
    $totalJobs = intval($stmt->fetch()['total']);
    
    // Get total sales (sum of job order totals)
    $stmt = $pdo->query("SELECT SUM(total_amount) as total_sales FROM job_orders");
    $totalSales = floatval($stmt->fetch()['total_sales'] ?? 0);
    
    // Get low stock items count
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM inventory WHERE status = 'Low Stock' OR status = 'Out of Stock'");
    $lowStockCount = intval($stmt->fetch()['total']);
    
    // Get low stock items details
    $stmt = $pdo->query("SELECT id, description as name, quantity as stocks, status, unit_price as price, srp_private as srp FROM inventory WHERE status = 'Low Stock' OR status = 'Out of Stock' ORDER BY description ASC");
    $lowStockItems = $stmt->fetchAll();
    
    sendSuccess([
        'total_products' => $totalProducts,
        'total_jobs' => $totalJobs,
        'total_sales' => $totalSales,
        'low_stock_count' => $lowStockCount,
        'low_stock_items' => $lowStockItems
    ]);
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 'DATABASE_ERROR', 500);
} catch (Exception $e) {
    sendError($e->getMessage(), 'ERROR', 500);
}
?>
