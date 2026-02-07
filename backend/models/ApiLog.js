const mongoose = require('mongoose');

const apiLogSchema = new mongoose.Schema({
  providerName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  endpointName: {
    type: String,
    required: true,
    trim: true
  },
  featureName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  requestCount: {
    type: Number,
    default: 1
  },
  responseTime: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'error'],
    default: 'success',
    index: true
  },
  statusCode: {
    type: Number
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  serviceIdentifier: {
    type: String,
    trim: true
  },
  calculatedCost: {
    type: Number,
    default: 0
  },
  requestBody: {
    type: mongoose.Schema.Types.Mixed
  },
  responseSize: {
    type: Number
  },
  errorMessage: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
apiLogSchema.index({ createdAt: -1 });
apiLogSchema.index({ providerName: 1, createdAt: -1 });
apiLogSchema.index({ featureName: 1, createdAt: -1 });

module.exports = mongoose.model('APILog', apiLogSchema);
