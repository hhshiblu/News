const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./error');
const routes = require('./routes');

const app = express();

/** Comma-separated browser origins allowed by CORS. Falls back to FRONTEND_URL if unset. */
function corsAllowedOrigins() {
  const fromCors = String(process.env.CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (fromCors.length) return fromCors;
  const fromFront = String(process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return fromFront.length ? fromFront : ['http://localhost:3000'];
}

// Middleware
app.use(
  cors({
    origin: corsAllowedOrigins(),
    credentials: true,
  })
);
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
