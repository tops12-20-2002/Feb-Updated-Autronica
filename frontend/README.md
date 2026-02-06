# Autronicas Frontend

React frontend application for the Autronicas Inventory System.

## Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Configuration

The API base URL is configured in `src/config.js`. By default, it points to:
```
http://localhost/autronicas-inventory-system/api
```

If your backend is running on a different URL, update this file.

## Project Structure

```
frontend/
├── public/          # Static assets (images, HTML)
├── src/
│   ├── api/         # API service functions
│   │   ├── auth.js
│   │   ├── inventory.js
│   │   ├── jobOrders.js
│   │   └── dashboard.js
│   ├── components/  # Reusable components
│   │   └── ProtectedRoute.js
│   ├── Pages/       # Page components
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── RoleSelectPage.js
│   │   ├── AdminDashboard.js
│   │   └── MechanicDashboard.js
│   ├── utils/       # Utility functions
│   │   └── auth.js
│   ├── config.js    # API configuration
│   ├── App.js       # Main app component
│   ├── index.js     # Entry point
│   └── Style.css    # Global styles
└── package.json
```

## Features

- **Authentication**: Login and registration with JWT tokens
- **Role-based Access**: Admin and Mechanic dashboards
- **Inventory Management**: CRUD operations for products (Admin only)
- **Job Order Management**: Create, edit, delete job orders with services and parts
- **Dashboard**: View statistics and overview
- **PDF Export**: Export job orders as PDF

## API Integration

All API calls are made through service functions in the `src/api/` directory:
- `auth.js`: Login, register, logout
- `inventory.js`: Product CRUD operations
- `jobOrders.js`: Job order CRUD operations
- `dashboard.js`: Dashboard statistics

## Authentication

The app uses JWT tokens stored in localStorage. The token is automatically included in API requests via the `Authorization` header.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

