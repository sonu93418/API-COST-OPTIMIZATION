const express = require('express');
const router = express.Router();
const {
  getAlerts,
  markAsRead,
  resolveAlert,
  detectAnomalies,
  deleteAlert
} = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getAlerts);
router.post('/detect', authorize('admin'), detectAnomalies);
router.put('/:id/read', markAsRead);
router.put('/:id/resolve', resolveAlert);
router.delete('/:id', authorize('admin'), deleteAlert);

module.exports = router;
