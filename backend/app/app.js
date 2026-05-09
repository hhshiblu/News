const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./error');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors({
  origin: (process.env.FRONTEND_URL || 'http://localhost:3000').split(','),
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload folders
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Main Route Mounting
app.use('/api/v1', routes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
