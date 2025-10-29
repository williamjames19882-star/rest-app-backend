# JWT Authentication and Admin Role Implementation

## Summary

The application now uses JWT tokens for authentication and includes role-based access control (RBAC) with admin privileges.

## What Was Implemented

### 1. Database Changes
- ✅ Added `role` column to `users` table
- ✅ Default role: `user`
- ✅ Admin role: `admin`

### 2. JWT Token Structure
Tokens now include user role:
```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "admin"
}
```

### 3. User Model Updates
- ✅ Include role when creating users
- ✅ Include role when fetching users
- ✅ Added `findAll()` method for admin

### 4. Authentication Middleware
- ✅ `authenticateToken` - Verifies JWT token
- ✅ `requireAdmin` - Checks if user is admin

### 5. Admin Routes (`/api/admin`)
All admin routes require authentication + admin role:

- ✅ `GET /api/admin/users` - View all users
- ✅ `GET /api/admin/reservations` - View all reservations
- ✅ `GET /api/admin/stats` - Dashboard statistics
- ✅ `POST /api/admin/menu/items` - Create menu item (with image upload)
- ✅ `PUT /api/admin/menu/items/:id` - Update menu item (with image upload)
- ✅ `DELETE /api/admin/menu/items/:id` - Delete menu item
- ✅ `PUT /api/admin/reservations/:id/status` - Update reservation status

## Quick Setup

### 1. Update Database Schema
```sql
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
```

### 2. Create Admin User
```bash
cd rest-app-backend
npm run create-admin
```

This creates:
- Email: `admin@restaurant.com`
- Password: `admin123`

### 3. Login as Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"admin123"}'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "role": "admin",
  "message": "Login successful"
}
```

### 4. Test Admin Endpoint
```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register (creates user with role='user')
- `POST /api/auth/login` - Login (returns JWT with role)

### Menu (Public - Read Only)
- `GET /api/menu/items` - Get all menu items
- `GET /api/menu/items/:id` - Get single menu item
- `GET /api/menu/categories` - Get all categories

### Reservations (Authenticated)
- `POST /api/reservations` - Create reservation (user only)
- `GET /api/reservations/my-reservations` - Get user's reservations
- `GET /api/reservations/tables/available` - Get available tables

### Admin (Admin Only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/reservations` - Get all reservations
- `GET /api/admin/stats` - Get statistics
- `POST /api/admin/menu/items` - Create menu item
- `PUT /api/admin/menu/items/:id` - Update menu item
- `DELETE /api/admin/menu/items/:id` - Delete menu item
- `PUT /api/admin/reservations/:id/status` - Update status

## Frontend Integration

### After Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { token, userId, role } = await response.json();

// Store token and role
localStorage.setItem('token', token);
localStorage.setItem('role', role);

// Check if admin
if (role === 'admin') {
  // Show admin features
}
```

### Making Admin API Calls
```javascript
const token = localStorage.getItem('token');

const response = await fetch('/api/admin/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const users = await response.json();
```

## Security Features

1. **JWT Tokens**: Secure, stateless authentication
2. **Role Validation**: Server-side role checking
3. **Password Hashing**: bcrypt with salt rounds
4. **Token Expiration**: 7 days
5. **CORS**: Configured for security

## Error Handling

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden (Not Admin)
```json
{
  "error": "Admin access required"
}
```

## Documentation Files
- `ADMIN_FEATURES.md` - Complete admin features guide
- `JWT_IMPLEMENTATION.md` - This file
- `create-admin.js` - Admin user creation script

## Next Steps

1. ✅ Run `npm run create-admin` to create admin user
2. ✅ Update your database: `ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';`
3. ✅ Test admin login and API endpoints
4. ✅ Build admin dashboard in frontend
5. ✅ Implement admin UI for:
   - User management
   - Reservation management
   - Menu management with image upload

## Testing

Test all endpoints using Postman or curl. See `ADMIN_FEATURES.md` for detailed examples.

