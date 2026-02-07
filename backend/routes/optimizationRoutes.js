const express = require('express');
const router = express.Router();
const {
  getSuggestions,
  getSuggestionsByType
} = require('../controllers/optimizationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/suggestions', getSuggestions);
router.get('/suggestions/:type', getSuggestionsByType);

module.exports = router;
