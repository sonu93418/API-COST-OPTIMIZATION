const express = require('express');
const router = express.Router();
const {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  updateCurrentSpend
} = require('../controllers/budgetController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAllBudgets)
  .post(authorize('admin'), createBudget);

router.post('/update-spend', authorize('admin'), updateCurrentSpend);

router.route('/:id')
  .put(authorize('admin'), updateBudget)
  .delete(authorize('admin'), deleteBudget);

module.exports = router;
