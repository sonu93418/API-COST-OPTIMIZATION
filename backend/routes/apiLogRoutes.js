const express = require('express');
const router = express.Router();
const {
  logAPICall,
  bulkLogAPICalls,
  deleteAPILog,
  clearAllLogs
} = require('../controllers/apiLogController');
const { protect } = require('../middleware/auth');

// Apply authentication to all routes
router.use(protect);

// Log routes
router.post('/', logAPICall);
router.post('/bulk', bulkLogAPICalls);
router.delete('/clear', clearAllLogs);
router.delete('/:id', deleteAPILog);

module.exports = router;
