# NaniCCP Backend API

A comprehensive Node.js REST API with MySQL database integration for a credit card payment portal system.

## Features

- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Payment processing with multiple methods
- QR code generation and processing
- Transaction management and tracking
- Support ticket system
- Contact form handling
- MySQL database integration
- CORS enabled
- Input validation
- Error handling

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   - Copy `.env` file and update the database credentials
   - Update `JWT_SECRET` with a secure secret key

4. Set up the database:
   - Create a MySQL database
   - Run the SQL script in `database.sql` to create all required tables
   - Or manually create the database and tables using the SQL provided

## Configuration

Update the `.env` file with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=naniccp_system

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```

2. The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/profile` - Get user profile (protected)
- **POST** `/api/auth/logout` - Logout user (protected)

### Payment Processing

- **POST** `/api/payment/process` - Process a payment (protected)
- **GET** `/api/payment/transactions` - Get user transactions (protected)
- **GET** `/api/payment/transactions/:id` - Get transaction by ID (protected)
- **GET** `/api/payment/stats` - Get transaction statistics (protected)
- **POST** `/api/payment/transactions/:id/refund` - Refund a transaction (protected)

### QR Code Management

- **POST** `/api/qr/generate` - Generate a QR code (protected)
- **GET** `/api/qr/codes` - Get user QR codes (protected)
- **GET** `/api/qr/codes/:id` - Get QR code by ID (protected)
- **POST** `/api/qr/process` - Process QR payment (protected)
- **GET** `/api/qr/download/:id` - Download QR code (protected)
- **POST** `/api/qr/cleanup` - Cleanup expired QR codes (protected)

### Support Tickets

- **POST** `/api/support/tickets` - Create a support ticket (protected)
- **GET** `/api/support/tickets` - Get user tickets (protected)
- **GET** `/api/support/tickets/:id` - Get ticket by ID (protected)
- **PUT** `/api/support/tickets/:id` - Update ticket (protected)
- **POST** `/api/support/tickets/:id/close` - Close ticket (protected)
- **GET** `/api/support/stats` - Get ticket statistics (protected)
- **GET** `/api/support/admin/tickets` - Get all tickets (admin, protected)
- **PUT** `/api/support/admin/tickets/:id/status` - Update ticket status (admin, protected)

### Contact & Support

- **POST** `/api/contact/submit` - Submit contact message (public)
- **GET** `/api/contact/faq` - Get FAQ data (public)
- **GET** `/api/contact/messages/:email` - Get messages by email (protected)
- **GET** `/api/contact/messages/:id` - Get message by ID (protected)
- **PUT** `/api/contact/messages/:id/status` - Update message status (protected)
- **GET** `/api/contact/admin/messages` - Get all messages (admin, protected)
- **GET** `/api/contact/admin/stats` - Get message statistics (admin, protected)

### Health Check

- **GET** `/api/health` - Check server status

## API Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get user profile (protected)

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Response Format

All API responses follow this format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {
    // Response data (if any)
  }
}
```

## Error Handling

The API includes comprehensive error handling for:
- Invalid input
- Duplicate users
- Invalid credentials
- Missing authentication tokens
- Database errors

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation
- SQL injection prevention
- CORS configuration

## Project Structure

```
nodejs-mysql-login/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── models/
│   └── User.js             # User model
├── routes/
│   └── auth.js             # Authentication routes
├── .env                    # Environment variables
├── database.sql            # Database setup script
├── package.json            # Dependencies
├── README.md              # This file
└── server.js              # Main server file
```

## Testing

You can test the API using:
- Postman
- curl commands
- Any HTTP client
- Frontend application

## Sample User

A sample user is created with the database setup:
- Username: `admin`
- Email: `admin@example.com`
- Password: `password123`
