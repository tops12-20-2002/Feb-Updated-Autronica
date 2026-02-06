<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/middleware.php';
require_once __DIR__ . '/response.php';

// Require authentication
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

function parseInventoryCodeFromDescription($description) {
    $desc = trim($description ?? '');
    if ($desc === '') return '';
    $parts = explode(' - ', $desc, 2);
    return trim($parts[0]);
}

function deductInventoryForParts($pdo, $parts) {
    foreach ($parts as $part) {
        $description = trim($part['description'] ?? '');
        if ($description === '') continue;

        $code = trim($part['code'] ?? '');
        if ($code === '') {
            $code = parseInventoryCodeFromDescription($description);
        }

        $qty = intval($part['qty'] ?? 0);
        if ($qty <= 0) continue;

        if ($code !== '') {
            $stmt = $pdo->prepare("
                UPDATE inventory
                SET
                    quantity = GREATEST(quantity - ?, 0),
                    status = CASE
                        WHEN (quantity - ?) <= 0 THEN 'Out of Stock'
                        WHEN min_quantity > 0 AND (quantity - ?) <= min_quantity THEN 'Low Stock'
                        ELSE 'In Stock'
                    END
                WHERE code = ?
            ");
            $stmt->execute([$qty, $qty, $qty, $code]);
        } else {
            // Fallback to match by description if no code is present
            $stmt = $pdo->prepare("
                UPDATE inventory
                SET
                    quantity = GREATEST(quantity - ?, 0),
                    status = CASE
                        WHEN (quantity - ?) <= 0 THEN 'Out of Stock'
                        WHEN min_quantity > 0 AND (quantity - ?) <= min_quantity THEN 'Low Stock'
                        ELSE 'In Stock'
                    END
                WHERE description = ?
            ");
            $stmt->execute([$qty, $qty, $qty, $description]);
        }
    }
}

try {
    switch ($method) {
        case 'GET':
            // Get all job orders with services and parts
            $id = $_GET['id'] ?? null;
            $jobOrderNo = $_GET['job_order_no'] ?? null;
            
            if ($id) {
                $stmt = $pdo->prepare("SELECT * FROM job_orders WHERE id = ?");
                $stmt->execute([$id]);
                $orders = [$stmt->fetch()];
            } elseif ($jobOrderNo) {
                $stmt = $pdo->prepare("SELECT * FROM job_orders WHERE job_order_no = ? ORDER BY id DESC");
                $stmt->execute([$jobOrderNo]);
                $orders = $stmt->fetchAll();
            } else {
                $stmt = $pdo->query("SELECT * FROM job_orders ORDER BY job_order_no DESC, id DESC");
                $orders = $stmt->fetchAll();
            }
            
            // Get services and parts for each job order
            foreach ($orders as &$order) {
                $jobOrderId = $order['id'];
                
                // Get services
                $stmt = $pdo->prepare("SELECT * FROM job_order_services WHERE job_order_id = ?");
                $stmt->execute([$jobOrderId]);
                $services = $stmt->fetchAll();
                $order['services'] = array_map(function($s) {
                    return [
                        'description' => $s['description'],
                        'qty' => (string)$s['quantity'],
                        'unit' => $s['unit'],
                        'price' => (string)$s['price']
                    ];
                }, $services);
                
                // Get parts
                $stmt = $pdo->prepare("SELECT * FROM job_order_parts WHERE job_order_id = ?");
                $stmt->execute([$jobOrderId]);
                $parts = $stmt->fetchAll();
                $order['parts'] = array_map(function($p) {
                    return [
                        'description' => $p['description'],
                        'qty' => (string)$p['quantity'],
                        'unit' => $p['unit'],
                        'price' => (string)$p['price']
                    ];
                }, $parts);
                
                // Map to frontend structure
                $order['joNumber'] = $order['job_order_no'];
                $order['client'] = $order['customer_name'];
                $order['vehicleModel'] = $order['model'];
                $order['plate'] = $order['plate_no'];
                $order['contactNumber'] = $order['contact_no'];
                $order['dateIn'] = $order['date'];
                $order['customerType'] = $order['type'];
                $order['total'] = $order['total_amount'];
            }
            
            sendSuccess($orders);
            break;
            
        case 'POST':
            // Create new job order with services and parts
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Get next job order number if not provided
            $jobOrderNo = intval($data['joNumber'] ?? $data['job_order_no'] ?? 0);
            // Get next job order number if not provided
            if (isset($data['joNumber']) && $data['joNumber'] !== '') {
                $jobOrderNo = intval($data['joNumber']); // use what frontend sent
            } else {
                // Auto-generate next number
                $stmt = $pdo->query("SELECT MAX(job_order_no) as max_no FROM job_orders");
                $result = $stmt->fetch();
                $jobOrderNo = ($result['max_no'] ?? -1) + 1; // start from 0 if empty
            }

            
            $customerType = $data['customerType'] ?? $data['type'] ?? 'Private';
            $clientName = trim($data['client'] ?? $data['customer_name'] ?? '');
            $address = trim($data['address'] ?? '');
            $contactNo = trim($data['contactNumber'] ?? $data['contact_no'] ?? '');
            $vehicleModel = trim($data['vehicleModel'] ?? $data['model'] ?? '');
            $plateNo = trim($data['plate'] ?? $data['plate_no'] ?? '');
            $dateIn = $data['dateIn'] ?? $data['date'] ?? date('Y-m-d');
            $dateRelease = $data['dateRelease'] ?? $data['date_release'] ?? null;
            $assignedTo = trim($data['assignedTo'] ?? $data['assigned_to'] ?? '');
            $status = $data['status'] ?? 'Pending';
            $services = $data['services'] ?? [];
            $parts = $data['parts'] ?? [];
            $subtotal = floatval($data['subtotal'] ?? 0);
            $discount = floatval($data['discount'] ?? 0);
            $total = floatval($data['total'] ?? $data['total_amount'] ?? 0);
            
            if (empty($clientName)) {
                sendValidationError('Client name is required');
            }
            
            // Start transaction
            $pdo->beginTransaction();
            
            try {
                // Insert job order
                $stmt = $pdo->prepare("INSERT INTO job_orders (job_order_no, type, customer_name, address, contact_no, model, plate_no, date, date_release, assigned_to, status, subtotal, discount, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$jobOrderNo, $customerType, $clientName, $address, $contactNo, $vehicleModel, $plateNo, $dateIn, $dateRelease, $assignedTo, $status, $subtotal, $discount, $total]);
                
                $jobOrderId = $pdo->lastInsertId();
                
                // Insert services
                foreach ($services as $service) {
                    $description = trim($service['description'] ?? '');
                    $qty = intval($service['qty'] ?? 1);
                    $unit = trim($service['unit'] ?? '');
                    $price = floatval($service['price'] ?? 0);
                    $total = $qty * $price;
                    
                    if (!empty($description)) {
                        $stmt = $pdo->prepare("INSERT INTO job_order_services (job_order_id, description, quantity, unit, price, total) VALUES (?, ?, ?, ?, ?, ?)");
                        $stmt->execute([$jobOrderId, $description, $qty, $unit, $price, $total]);
                    }
                }
                
                // Insert parts
                foreach ($parts as $part) {
                    $description = trim($part['description'] ?? '');
                    $qty = intval($part['qty'] ?? 1);
                    $unit = trim($part['unit'] ?? '');
                    $price = floatval($part['price'] ?? 0);
                    $total = $qty * $price;
                    
                    if (!empty($description)) {
                        $stmt = $pdo->prepare("INSERT INTO job_order_parts (job_order_id, description, quantity, unit, price, total) VALUES (?, ?, ?, ?, ?, ?)");
                        $stmt->execute([$jobOrderId, $description, $qty, $unit, $price, $total]);
                    }
                }

                // Deduct inventory only when job order is completed
                if ($status === 'Completed') {
                    deductInventoryForParts($pdo, $parts);
                }
                
                $pdo->commit();
                
                // Get created job order with services and parts
                $stmt = $pdo->prepare("SELECT * FROM job_orders WHERE id = ?");
                $stmt->execute([$jobOrderId]);
                $order = $stmt->fetch();
                
                // Get services and parts
                $stmt = $pdo->prepare("SELECT * FROM job_order_services WHERE job_order_id = ?");
                $stmt->execute([$jobOrderId]);
                $order['services'] = $stmt->fetchAll();
                
                $stmt = $pdo->prepare("SELECT * FROM job_order_parts WHERE job_order_id = ?");
                $stmt->execute([$jobOrderId]);
                $order['parts'] = $stmt->fetchAll();
                
                sendSuccess($order, 'Job order created successfully');
            } catch (Exception $e) {
                $pdo->rollBack();
                throw $e;
            }
            break;
            
        case 'PUT':
            // Update job order
            $data = json_decode(file_get_contents('php://input'), true);
            $id = intval($data['id'] ?? 0);
            
            if ($id <= 0) {
                sendValidationError('Invalid job order ID');
            }
            
            $jobOrderNo = intval($data['joNumber'] ?? $data['job_order_no'] ?? 0);
            $customerType = $data['customerType'] ?? $data['type'] ?? 'Private';
            $clientName = trim($data['client'] ?? $data['customer_name'] ?? '');
            $address = trim($data['address'] ?? '');
            $contactNo = trim($data['contactNumber'] ?? $data['contact_no'] ?? '');
            $vehicleModel = trim($data['vehicleModel'] ?? $data['model'] ?? '');
            $plateNo = trim($data['plate'] ?? $data['plate_no'] ?? '');
            $dateIn = $data['dateIn'] ?? $data['date'] ?? date('Y-m-d');
            $dateRelease = $data['dateRelease'] ?? $data['date_release'] ?? null;
            $assignedTo = trim($data['assignedTo'] ?? $data['assigned_to'] ?? '');
            $status = $data['status'] ?? 'Pending';
            $services = $data['services'] ?? [];
            $parts = $data['parts'] ?? [];
            $subtotal = floatval($data['subtotal'] ?? 0);
            $discount = floatval($data['discount'] ?? 0);
            $total = floatval($data['total'] ?? $data['total_amount'] ?? 0);
            
            // Start transaction
            $pdo->beginTransaction();
            
            try {
                // Check previous status to avoid double deduction
                $stmt = $pdo->prepare("SELECT status FROM job_orders WHERE id = ?");
                $stmt->execute([$id]);
                $prevStatus = $stmt->fetchColumn();

                // Update job order
                $stmt = $pdo->prepare("UPDATE job_orders SET job_order_no = ?, type = ?, customer_name = ?, address = ?, contact_no = ?, model = ?, plate_no = ?, date = ?, date_release = ?, assigned_to = ?, status = ?, subtotal = ?, discount = ?, total_amount = ? WHERE id = ?");
                $stmt->execute([$jobOrderNo, $customerType, $clientName, $address, $contactNo, $vehicleModel, $plateNo, $dateIn, $dateRelease, $assignedTo, $status, $subtotal, $discount, $total, $id]);
                
                // Delete old services and parts (cascade will handle this, but we'll do it explicitly)
                $stmt = $pdo->prepare("DELETE FROM job_order_services WHERE job_order_id = ?");
                $stmt->execute([$id]);
                
                $stmt = $pdo->prepare("DELETE FROM job_order_parts WHERE job_order_id = ?");
                $stmt->execute([$id]);
                
                // Insert new services
                foreach ($services as $service) {
                    $description = trim($service['description'] ?? '');
                    $qty = intval($service['qty'] ?? 1);
                    $unit = trim($service['unit'] ?? '');
                    $price = floatval($service['price'] ?? 0);
                    $total = $qty * $price;
                    
                    if (!empty($description)) {
                        $stmt = $pdo->prepare("INSERT INTO job_order_services (job_order_id, description, quantity, unit, price, total) VALUES (?, ?, ?, ?, ?, ?)");
                        $stmt->execute([$id, $description, $qty, $unit, $price, $total]);
                    }
                }
                
                // Insert new parts
                foreach ($parts as $part) {
                    $description = trim($part['description'] ?? '');
                    $qty = intval($part['qty'] ?? 1);
                    $unit = trim($part['unit'] ?? '');
                    $price = floatval($part['price'] ?? 0);
                    $total = $qty * $price;
                    
                    if (!empty($description)) {
                        $stmt = $pdo->prepare("INSERT INTO job_order_parts (job_order_id, description, quantity, unit, price, total) VALUES (?, ?, ?, ?, ?, ?)");
                        $stmt->execute([$id, $description, $qty, $unit, $price, $total]);
                    }
                }

                // Deduct inventory only on transition to Completed
                if ($prevStatus !== 'Completed' && $status === 'Completed') {
                    deductInventoryForParts($pdo, $parts);
                }
                
                $pdo->commit();
                
                // Get updated job order
                $stmt = $pdo->prepare("SELECT * FROM job_orders WHERE id = ?");
                $stmt->execute([$id]);
                $order = $stmt->fetch();
                
                // Get services and parts
                $stmt = $pdo->prepare("SELECT * FROM job_order_services WHERE job_order_id = ?");
                $stmt->execute([$id]);
                $order['services'] = $stmt->fetchAll();
                
                $stmt = $pdo->prepare("SELECT * FROM job_order_parts WHERE job_order_id = ?");
                $stmt->execute([$id]);
                $order['parts'] = $stmt->fetchAll();
                
                sendSuccess($order, 'Job order updated successfully');
            } catch (Exception $e) {
                $pdo->rollBack();
                throw $e;
            }
            break;
            
        case 'DELETE':
    $data = json_decode(file_get_contents('php://input'), true);
    $id = intval($data['id'] ?? 0);

    if ($id <= 0) {
        sendValidationError('Invalid job order ID');
    }

    // Get deleted job order number
    $stmt = $pdo->prepare("SELECT job_order_no FROM job_orders WHERE id = ?");
    $stmt->execute([$id]);
    $deletedNumber = $stmt->fetchColumn();

    // Delete the job order
    $stmt = $pdo->prepare("DELETE FROM job_orders WHERE id = ?");
    $stmt->execute([$id]);

    // Shift down all job orders with higher numbers
    $stmt = $pdo->prepare("UPDATE job_orders SET job_order_no = job_order_no - 1 WHERE job_order_no > ?");
    $stmt->execute([$deletedNumber]);

    sendSuccess(null, 'Job order deleted and numbers shifted successfully');
    break;

            
        default:
            sendError('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
    }
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendError('Database error: ' . $e->getMessage(), 'DATABASE_ERROR', 500);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendError($e->getMessage(), 'ERROR', 500);
}
?>
