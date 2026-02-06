# Autronicas Inventory System - API Documentation

## Base URL

```
http://localhost/autronicas-inventory-system/api/
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

Tokens are returned on successful login or registration and expire after 24 hours.

## Response Format

All responses follow this structure:

**Success:**
```json
{
  "success": true,
  "data": {...},
  "message": "Optional message"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Endpoints

### Authentication

#### Login
**POST** `/login.php`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "admin"
    }
  },
  "message": "Login successful"
}
```

**Error Responses:**
- `400` - Validation error (missing fields, invalid email format)
- `401` - Invalid credentials

---

#### Register
**POST** `/register.php`

**Request:**
```json
{
  "full_name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "mechanic"
    }
  },
  "message": "Registration successful"
}
```

**Error Responses:**
- `400` - Validation error (missing fields, invalid email, password too short)
- `409` - Email already exists

---

#### Logout
**POST** `/logout.php`

**Request:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Inventory

#### Get All Inventory Items
**GET** `/inventory.php`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Engine Oil",
      "stocks": 50,
      "status": "In Stock",
      "price": "100.00",
      "srp": "125.00",
      "code": "EO001",
      "category": "Lubricants",
      "min_quantity": 10
    }
  ]
}
```

---

#### Create Inventory Item
**POST** `/inventory.php`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Engine Oil",
  "quantity": 50,
  "price": 100.00,
  "srp": 125.00,
  "code": "EO001",
  "category": "Lubricants",
  "minQuantity": 10
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Engine Oil",
    "stocks": 50,
    "status": "In Stock",
    "price": "100.00",
    "srp": "125.00"
  },
  "message": "Item added successfully"
}
```

---

#### Update Inventory Item
**PUT** `/inventory.php`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "id": 1,
  "name": "Engine Oil Premium",
  "quantity": 45,
  "price": 110.00,
  "srp": 137.50
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {...},
  "message": "Item updated successfully"
}
```

---

#### Delete Inventory Item
**DELETE** `/inventory.php`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "id": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

---

### Job Orders

#### Get All Job Orders
**GET** `/job_orders.php`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters (optional):**
- `id` - Get specific job order by ID
- `job_order_no` - Get job orders by job order number

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "job_order_no": 1,
      "joNumber": 1,
      "client": "John Doe",
      "customer_name": "John Doe",
      "address": "123 Main St",
      "contactNumber": "09123456789",
      "vehicleModel": "Toyota Vios",
      "model": "Toyota Vios",
      "plate": "ABC-1234",
      "plate_no": "ABC-1234",
      "dateIn": "2024-01-15",
      "date": "2024-01-15",
      "date_release": "2024-01-16",
      "customerType": "Private",
      "type": "Private",
      "assigned_to": "Mechanic Name",
      "status": "Pending",
      "subtotal": 5000.00,
      "discount": 0.00,
      "total": 5000.00,
      "total_amount": 5000.00,
      "services": [
        {
          "description": "Oil Change",
          "qty": "1",
          "unit": "Service",
          "price": "500.00"
        }
      ],
      "parts": [
        {
          "description": "Engine Oil",
          "qty": "5",
          "price": "100.00"
        }
      ]
    }
  ]
}
```

---

#### Create Job Order
**POST** `/job_orders.php`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "client": "John Doe",
  "address": "123 Main St",
  "contactNumber": "09123456789",
  "vehicleModel": "Toyota Vios",
  "plate": "ABC-1234",
  "dateIn": "2024-01-15",
  "dateRelease": "2024-01-16",
  "customerType": "Private",
  "assignedTo": "Mechanic Name",
  "status": "Pending",
  "services": [
    {
      "description": "Oil Change",
      "qty": "1",
      "unit": "Service",
      "price": "500.00"
    }
  ],
  "parts": [
    {
      "description": "Engine Oil",
      "qty": "5",
      "price": "100.00"
    }
  ],
  "subtotal": 1000.00,
  "discount": 0.00,
  "total": 1000.00
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {...},
  "message": "Job order created successfully"
}
```

---

#### Update Job Order
**PUT** `/job_orders.php`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:** Same as create, but include `id` field

**Response (200):**
```json
{
  "success": true,
  "data": {...},
  "message": "Job order updated successfully"
}
```

---

#### Delete Job Order
**DELETE** `/job_orders.php`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "id": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Job order deleted successfully"
}
```

---

### Dashboard

#### Get Dashboard Statistics
**GET** `/dashboard.php`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_products": 150,
    "total_jobs": 45,
    "total_sales": 125000.00,
    "low_stock_count": 5,
    "low_stock_items": [
      {
        "id": 1,
        "name": "Engine Oil",
        "stocks": 5,
        "status": "Low Stock",
        "price": "100.00",
        "srp": "125.00"
      }
    ]
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `METHOD_NOT_ALLOWED` | HTTP method not allowed for endpoint |
| `VALIDATION_ERROR` | Request validation failed |
| `UNAUTHORIZED` | Missing or invalid JWT token |
| `EMAIL_EXISTS` | Email already registered |
| `NOT_FOUND` | Resource not found |
| `DATABASE_ERROR` | Database operation failed |
| `ERROR` | General error |

## HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `405` - Method Not Allowed
- `409` - Conflict (e.g., email exists)
- `500` - Internal Server Error

## Notes

- All timestamps are in ISO 8601 format (YYYY-MM-DD HH:MM:SS)
- All monetary values are in PHP (₱) and stored as DECIMAL(10,2)
- Job order numbers are auto-incremented if not provided
- Inventory status is automatically calculated based on quantity vs min_quantity
- Customer types: "Private", "LGU", "STAN"
- Job order statuses: "Pending", "In Progress", "Completed"

