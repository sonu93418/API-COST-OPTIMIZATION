const express = require('express');
const router = express.Router();
const {
  getAllPricing,
  getPricing,
  createPricing,
  updatePricing,
  deletePricing
} = require('../controllers/pricingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAllPricing)
  .post(authorize('admin'), createPricing);

router.route('/:id')
  .get(getPricing)
  .put(authorize('admin'), updatePricing)
  .delete(authorize('admin'), deletePricing);

module.exports = router;
