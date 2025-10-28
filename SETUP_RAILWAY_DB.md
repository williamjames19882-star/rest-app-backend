# Railway Database Setup

## Configuration Complete!

Your database connection has been updated to use Railway MySQL.

## Connection Details:
- **Host**: gondola.proxy.rlwy.net
- **Port**: 10489
- **User**: root
- **Password**: auIxPbisSsrsEJMOIAdtWPpepNNKNkDE
- **Database**: railway

## Setup Steps:

### 1. Create .env file
If `.env` file doesn't exist, create it in the `rest-app-backend` folder:

```bash
cd rest-app-backend
```

Copy the contents from `env.example` to create `.env` file, or run:

**On Windows PowerShell:**
```powershell
Copy-Item env.example .env
```

**On Linux/Mac:**
```bash
cp env.example .env
```

The `.env` file already has the Railway credentials configured!

### 2. Run Database Schema
You need to create the database tables. You have two options:

#### Option A: Using MySQL CLI (Recommended)
```bash
# Connect to Railway MySQL
mysql -h gondola.proxy.rlwy.net -P 10489 -u root -p auIxPbisSsrsEJMOIAdtWPpepNNKNkDE railway < database.sql
```

#### Option B: Import via MySQL Workbench
1. Open MySQL Workbench
2. Create new connection:
   - Host: `gondola.proxy.rlwy.net`
   - Port: `10489`
   - Username: `root`
   - Password: `auIxPbisSsrsEJMOIAdtWPpepNNKNkDE`
3. Connect to database `railway`
4. File → Open SQL Script → Select `database.sql`
5. Execute

### 3. Test the Connection
Start your backend server:
```bash
cd rest-app-backend
npm start
```

The server should connect to Railway MySQL successfully!

## Important Notes:

### For Local Development
When you want to work locally, comment out the Railway settings in `.env` and uncomment the local ones:

```env
# Comment Railway settings
# DB_HOST=gondola.proxy.rlwy.net
# DB_PORT=10489
# ...

# Uncomment local settings
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=restaurant_db
```

### Database Name
The Railway database is named `railway` (not `restaurant_db`). All your tables will be created in this database.

### Connection String
Railway connection URL:
```
mysql://root:auIxPbisSsrsEJMOIAdtWPpepNNKNkDE@gondola.proxy.rlwy.net:10489/railway
```

## Troubleshooting

If you get connection errors:
1. Check your `.env` file exists and has correct values
2. Verify Railway database is running
3. Check firewall allows connection to port 10489
4. Test connection with: `mysql -h gondola.proxy.rlwy.net -P 10489 -u root -p railway`

