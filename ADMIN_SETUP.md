# Admin Panel Setup Guide

## Overview
This e-commerce application includes a comprehensive admin panel that allows administrators to manage products, users, orders, and view analytics.

## Default Admin Credentials
- **Email**: admin@gmail.com
- **Password**: admin

## Admin Panel Features

### 🏠 Dashboard Console
- Overview statistics (products, orders, revenue, users)
- Recent activities feed
- Quick action buttons
- Performance metrics

### 📦 Product Management
- Add new products to Shirts and Pants categories
- Edit existing products
- Update product details (name, price, brand, stock, description)
- Upload product images
- Delete products
- View all products in a beautiful table format

### 👥 User Management
- View all registered users
- Create new user accounts
- Edit user information
- Toggle admin privileges
- Delete user accounts
- User status overview

### 📋 Order Management
- View all customer orders
- Update order status (paid/delivered)
- Delete orders
- Order statistics and revenue tracking
- Customer order history

### 📊 Reports & Analytics
- Overview report with key metrics
- Sales trends and daily breakdown
- Product performance analysis
- User behavior and customer insights
- Exportable reports (CSV format)

## Getting Started

### 1. Start the Backend Server
```bash
cd backend
npm start
```
The server will automatically create the default admin user when it starts.

### 2. Start the Frontend Application
```bash
cd frontend
npm start
```
The application will be available at http://localhost:3000

### 3. Access Admin Panel
1. Navigate to the application
2. Click "Sign In" in the top navigation
3. Enter the admin credentials:
   - Email: admin@gmail.com
   - Password: admin
4. After successful login, you'll be automatically redirected to the admin dashboard
5. Regular users will be redirected to the home page

## Admin Panel Navigation

The admin panel features a beautiful sidebar navigation with:
- **Dashboard** - Overview and quick actions
- **Products** - Product management interface
- **Users** - User management and administration
- **Orders** - Order processing and tracking  
- **Reports** - Analytics and reporting tools

## Features Highlights

### Security Features
- Protected routes (only admins can access admin panel)
- Secure authentication with JWT tokens
- Password hashing with bcrypt
- Admin privilege verification

### UI/UX Features
- Modern, responsive design
- Beautiful sidebar navigation
- Comprehensive form validation
- Real-time status updates
- Professional admin dashboard styling

### Management Capabilities
- Complete CRUD operations for all entities
- Bulk actions and management
- Real-time statistics
- Export functionality
- Advanced filtering and search

## Product Categories
The system supports two main categories:
- **Shirts** - All shirt-related products
- **Pants** - All pants-related products

## API Endpoints

### Admin Routes
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get dashboard statistics

### Core Routes
- `POST /api/users/signin` - User authentication
- `GET /api/products` - Product listings
- `POST /api/products` - Create product (admin only)
- `GET /api/orders` - Order management

## Development Notes

### Technologies Used
- **Backend**: Node.js, Express.js, mongoose, JWT
- **Frontend**: React.js, Redux, Redux-Thunk
- **Database**: MongoDB
- **Styling**: Custom CSS with modern design principles

### File Structure
```
frontend/src/screens/admin/
├── AdminDashboard.js    # Main dashboard
├── AdminProducts.js     # Product management
├── AdminUsers.js        # User management
├── AdminOrders.js       # Order management
├── AdminReports.js      # Reports and analytics
├── AdminPanel.js        # Main admin panel wrapper
└── AdminStyle.css       # Admin-specific styles

backend/routes/
└── adminRoute.js        # Admin API endpoints
```

## Troubleshooting

### Cannot Access Admin Panel
1. Ensure you're logged in with admin credentials
2. Check browser console for any errors
3. Verify backend server is running
4. Check MongoDB connection

### Default Admin User Issues
- The admin user is automatically created when the server starts
- If login fails, try refreshing the page
- Check server console for admin user creation confirmation

### Product Management Issues
- Ensure product categories are exactly "Shirts" or "Pants"
- Check image URL format for product uploads
- Verify required fields are filled properly

## Support
For any issues or questions regarding the admin panel, please check the console logs and ensure all dependencies are properly installed.
