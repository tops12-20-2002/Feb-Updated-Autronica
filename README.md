# Autronicas Inventory Management System

A full-stack inventory management system with a PHP REST API backend and React frontend.

## Prerequisites

### Backend
- XAMPP (Apache + MySQL)
- PHP 7.4 or higher
- Composer (PHP package manager)
- MySQL (via XAMPP)

### Frontend
- Node.js 14+ and npm
- React 18+

## Installation

### 1. Clone/Download the Repository

Place the project folder in your XAMPP `htdocs` directory:
```
C:\xampp\htdocs\autronicas-inventory-system\
```

### 2. Backend Setup

#### Install PHP Dependencies

Open a terminal/command prompt in the project root directory and run:

```bash
composer install
```

This will install the required dependencies (firebase/php-jwt) in the `vendor/` directory.

**Note:** If you don't have Composer installed, download it from (https://getcomposer.org/download/)

#### Database Setup

1. Start XAMPP Control Panel
2. Start Apache and MySQL services
3. Open phpMyAdmin: `http://localhost/phpmyadmin`
4. Import the database:
   - Click on "SQL" tab
   - Select `database.sql` file
   - Click "Go" to execute

   **OR** for existing databases:
   - Run `database_migration.sql` to update the schema

#### Configure Database Connection

Edit `config.php` and verify database settings:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'autronicas_db');
define('DB_USER', 'root');
define('DB_PASS', ''); // Empty by default in XAMPP
```

#### Configure JWT Secret

Edit `config.php` and set a secure JWT secret:
```php
define('JWT_SECRET', 'your-secret-key-change-this-in-production-use-a-long-random-string');
```

#### Configure CORS

Edit `config.php` and set your React frontend URL:
```php
define('CORS_ORIGIN', 'http://localhost:3000'); // Your React app URL
```

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure API URL (if needed):
   - Edit `frontend/src/config.js` if your backend is on a different URL

4. Start the development server:
```bash
npm start
```

The frontend will run at `http://localhost:3000`

For more frontend details, see `frontend/README.md`

## API Endpoints

### Authentication

- `POST /api/login.php` - Login with email and password
- `POST /api/register.php` - Register new user
- `POST /api/logout.php` - Logout (blacklist token)

### Protected Endpoints (Require JWT Token)

- `GET /api/inventory.php` - Get all inventory items
- `POST /api/inventory.php` - Create new inventory item
- `PUT /api/inventory.php` - Update inventory item
- `DELETE /api/inventory.php` - Delete inventory item

- `GET /api/job_orders.php` - Get all job orders
- `POST /api/job_orders.php` - Create new job order
- `PUT /api/job_orders.php` - Update job order
- `DELETE /api/job_orders.php` - Delete job order

- `GET /api/dashboard.php` - Get dashboard statistics

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The token is returned when you login or register.

## Testing with Postman

1. **Login:**
   - Method: POST
   - URL: `http://localhost/autronicas-inventory-system/api/login.php`
   - Body (JSON):
     ```json
     {
       "email": "user@example.com",
       "password": "password"
     }
     ```
   - Copy the `token` from the response

2. **Access Protected Endpoint:**
   - Method: GET
   - URL: `http://localhost/autronicas-inventory-system/api/inventory.php`
   - Headers:
     ```
     Authorization: Bearer <your_token>
     ```

## Project Structure

```
autronicas-inventory-system/
├── api/                      # Backend API endpoints
│   ├── cors.php              # CORS configuration
│   ├── jwt.php               # JWT token handling
│   ├── middleware.php        # Authentication middleware
│   ├── response.php          # Standardized response helpers
│   ├── login.php             # Login endpoint
│   ├── register.php          # Registration endpoint
│   ├── logout.php            # Logout endpoint
│   ├── inventory.php         # Inventory CRUD
│   ├── job_orders.php        # Job orders CRUD
│   └── dashboard.php         # Dashboard statistics
├── frontend/                 # React frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── api/              # API service functions
│   │   ├── components/       # React components
│   │   ├── Pages/            # Page components
│   │   ├── utils/            # Utility functions
│   │   └── config.js         # API configuration
│   └── package.json          # Frontend dependencies
├── config.php                # Backend configuration
├── db.php                    # Database connection
├── database.sql              # Database schema
├── database_migration.sql    # Migration script
├── composer.json             # PHP dependencies
└── README.md                 # This file
```

## Troubleshooting

### Composer install fails
- Make sure PHP is in your system PATH
- Try: `php composer.phar install` instead

### Database connection fails
- Verify MySQL is running in XAMPP
- Check database credentials in `config.php`
- Ensure database `autronicas_db` exists

### CORS errors
- Verify `CORS_ORIGIN` in `config.php` matches your frontend URL
- Check that `api/cors.php` is included at the top of all endpoints

### JWT errors
- Verify `JWT_SECRET` is set in `config.php`
- Check that `vendor/autoload.php` exists (run `composer install`)

## Production Deployment

For production deployment instructions, see [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)

## Security Notes

- **Never commit `config.php`** to version control
- Change the default JWT secret in production
- Use strong database passwords
- Enable HTTPS in production
- Review and update CORS settings for your domain
- Set `display_errors = 0` in production config

## License

This project is under private ownership.