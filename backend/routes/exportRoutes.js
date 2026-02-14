const express = require('express');
const { exportHTML, exportJSON } = require('../controllers/exportController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Export routes
router.post('/html/:id', protect, exportHTML);
router.get('/json/:id', protect, exportJSON);

module.exports = router;
