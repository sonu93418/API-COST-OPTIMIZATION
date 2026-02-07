const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  providerName: {
    type: String,
    required: true,
    trim: true
  },
  monthlyLimit: {
    type: Number,
    required: true,
    min: 0
  },
  alertThreshold: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 80
  },
  currentSpend: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  period: {
    type: String,
    default: function() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
  }
}, {
  timestamps: true
});

budgetSchema.index({ providerName: 1, period: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
