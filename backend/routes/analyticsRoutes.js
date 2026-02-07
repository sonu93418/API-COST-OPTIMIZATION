const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getLogs,
  getCostTrends,
  getProviders,
  getFeatures
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/logs', getLogs);
router.get('/cost-trends', getCostTrends);
router.get('/providers', getProviders);
router.get('/features', getFeatures);

module.exports = router;
