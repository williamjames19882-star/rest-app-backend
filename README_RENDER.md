# Deploying Backend to Render

## Quick Setup

### 1. Database Configuration (Railway)
Your database is already configured with Railway MySQL in the `.env` file:
- **Host**: gondola.proxy.rlwy.net
- **Port**: 10489
- **User**: root
- **Password**: auIxPbisSsrsEJMOIAdtWPpepNNKNkDE
- **Database**: railway

### 2. Environment Variables for Render

When deploying to Render, add these environment variables in Render dashboard:

```
PORT=5000
DB_HOST=gondola.proxy.rlwy.net
DB_PORT=10489
DB_USER=root
DB_PASSWORD=auIxPbisSsrsEJMOIAdtWPpepNNKNkDE
DB_NAME=railway
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### 3. Render Deployment Steps

1. **Push code to GitHub**
2. **Go to Render Dashboard**: https://dashboard.render.com
3. **New Web Service**
4. **Connect your repository**
5. **Configure**:
   - **Name**: rest-app-backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Add all the variables above
6. **Deploy**

### 4. Important: Before Deployment

Make sure the database schema is created in Railway MySQL:

```bash
# Connect to Railway MySQL and run:
mysql -h gondola.proxy.rlwy.net -P 10489 -u root -pauIxPbisSsrsEJMOIAdtWPpepNNKNkDE railway

# Then run database.sql
source database.sql
```

Or use MySQL Workbench to import `database.sql` into the `railway` database.

### 5. Backend URL

Once deployed, your backend will be at:
`https://rest-app-backend.onrender.com`

Update your frontend to use this URL (already done in `src/api/api.js`).

## Health Check

After deployment, test your backend:
```
https://rest-app-backend.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Restaurant API is running"
}
```

## Troubleshooting

### Database Connection Issues
- Verify Railway MySQL is running
- Check credentials in environment variables
- Test connection from your local machine first

### CORS Issues
- Update `FRONTEND_URL` in environment variables
- Or keep it as `*` for development

### Build Fails
- Make sure `package.json` has correct start script
- Check Node version compatibility (use Node 14+)

## Test Locally with Production Database

To test with Railway database locally:
```bash
# Update .env with Railway credentials (already done)
npm start
```

Your backend will connect to Railway MySQL and work as if deployed!

