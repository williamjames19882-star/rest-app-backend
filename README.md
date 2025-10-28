# Restaurant App Backend

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create MySQL database:
```bash
mysql -u root -p < database.sql
```

3. Update `.env` file with your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=restaurant_db
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
```

4. Run the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Create new user
- POST `/api/auth/login` - Login user

### Menu
- GET `/api/menu/items` - Get all menu items
- GET `/api/menu/items/:id` - Get single menu item
- GET `/api/menu/categories` - Get all categories

### Reservations
- GET `/api/reservations/tables/available` - Get available tables (requires auth)
- POST `/api/reservations` - Create reservation (requires auth)
- GET `/api/reservations/my-reservations` - Get user's reservations (requires auth)

