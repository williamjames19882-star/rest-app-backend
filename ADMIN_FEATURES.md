# Admin Features Documentation

## Overview

The application now includes role-based authentication with admin privileges. Users with the `admin` role have access to special administrative features.

## User Roles

### Regular User (`user`)
- Can sign up and login
- View menu items
- Book tables
- View their own reservations

### Admin User (`admin`)
- All regular user features PLUS:
- View all users
- View all reservations (from all users)
- Create new menu items
- Edit existing menu items
- Delete menu items
- Update reservation status
- View dashboard statistics

## Setup Admin User

### Option 1: Using Script (Recommended)
```bash
cd rest-app-backend
npm run create-admin
```

This creates an admin user with:
- Email: `admin@restaurant.com`
- Password: `admin123`

⚠️ **Change the password immediately in production!**

### Option 2: Manual Creation
```sql
-- Connect to your database and run:
INSERT INTO users (name, email, password, phone, role)
VALUES (
  'Admin User',
  'admin@restaurant.com',
  '$2a$10$YourHashedPasswordHere',  -- Use bcrypt to hash a password
  '0000000000',
  'admin'
);
```

To hash a password using Node.js:
```javascript
const bcrypt = require('bcryptjs');
const hashed = await bcrypt.hash('your_password', 10);
console.log(hashed);
```

### Option 3: Update Existing User
```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## JWT Token Structure

When a user logs in, the JWT token now includes the user's role:

```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "user"  // or "admin"
}
```

### Login Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "role": "admin",  // NEW: includes role
  "message": "Login successful"
}
```

## Admin API Endpoints

All admin endpoints are prefixed with `/api/admin` and require authentication + admin role.

### 1. Get All Users
**GET** `/api/admin/users`

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. Get All Reservations (Admin View)
**GET** `/api/admin/reservations`

Shows ALL reservations from ALL users with full user details.

**Response**:
```json
[
  {
    "id": 1,
    "user_id": 1,
    "table_id": 3,
    "date": "2024-01-15",
    "time": "19:00:00",
    "number_of_guests": 4,
    "special_requests": "Window seat preferred",
    "status": "confirmed",
    "created_at": "2024-01-10T00:00:00.000Z",
    "user_name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "table_number": "T03",
    "capacity": 4,
    "location": "Main Hall"
  }
]
```

### 3. Create Menu Item
**POST** `/api/admin/menu/items`

**Body**:
```json
{
  "name": "New Pizza",
  "description": "Delicious pizza",
  "price": 15.99,
  "category": "Pizza",
  "image_url": "https://example.com/image.jpg"
}
```

### 4. Update Menu Item
**PUT** `/api/admin/menu/items/:id`

**Body**:
```json
{
  "name": "Updated Pizza",
  "description": "Even better pizza",
  "price": 18.99,
  "category": "Pizza",
  "image_url": "https://example.com/new-image.jpg"
}
```

### 5. Delete Menu Item
**DELETE** `/api/admin/menu/items/:id`

### 6. Update Reservation Status
**PUT** `/api/admin/reservations/:id/status`

**Body**:
```json
{
  "status": "cancelled"  // or "confirmed", "completed"
}
```

### 7. Get Dashboard Statistics
**GET** `/api/admin/stats`

**Response**:
```json
{
  "users": 50,
  "reservations": 120,
  "menuItems": 15,
  "estimatedRevenue": 5000.00
}
```

## Frontend Integration

### Check if User is Admin

```javascript
// In your frontend after login
const { token, role } = response.data;

// Store role
localStorage.setItem('role', role);

// Check if admin
const isAdmin = role === 'admin';
```

### Show/Hide Admin Features

```javascript
const role = localStorage.getItem('role');

if (role === 'admin') {
  // Show admin dashboard link
  // Show admin menu items
  // etc.
}
```

### API Calls with Admin Access

```javascript
// Admin API calls require Bearer token
const response = await fetch('http://localhost:5000/api/admin/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **JWT Secret**: Use a strong JWT secret in production
2. **Admin Password**: Change default admin password immediately
3. **HTTPS**: Always use HTTPS in production
4. **Token Expiration**: Tokens expire after 7 days
5. **Role Validation**: Always verify role on server-side

## Error Responses

### Unauthorized (401)
```json
{
  "error": "Access token required"
}
```

### Forbidden (403)
```json
{
  "error": "Admin access required"
}
```

## Testing

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"admin123"}'
```

### Test Admin Endpoint
```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database Schema

Users table now includes:
```sql
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
```

Existing users will have `role = 'user'` by default.

