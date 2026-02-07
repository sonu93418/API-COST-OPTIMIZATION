const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema({
  providerName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  costPerRequest: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  freeTierLimit: {
    type: Number,
    default: 0
  },
  tierPricing: [{
    from: { type: Number, required: true },
    to: { type: Number },
    costPerRequest: { type: Number, required: true }
  }],
  billingCycle: {
    type: String,
    enum: ['monthly', 'daily', 'per-request'],
    default: 'per-request'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PricingRule', pricingRuleSchema);
