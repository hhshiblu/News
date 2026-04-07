const express = require('express');
const router = express.Router();

// Import Router Aggregators
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

// Mount Router Aggregators
router.use('/admin', adminRoutes);
router.use('/public', publicRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

module.exports = router;
