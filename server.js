const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS - allow all origins in development, specific origins in production
const allowedOrigins = [
  process.env.VERCEL_FRONTEND_URL,        // https://yourdomain.com
  process.env.MY_FRONTEND_URL,         // if you have admin
  process.env.MY_FRONTEND_URL_WWW           // if you have admin
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server calls & postman (origin = undefined)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Blocked by CORS: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Signature',
    'X-Requested-With'
  ]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/category-images', require('./routes/categoryImages'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/addresses', require('./routes/addresses'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Restaurant API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

