require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const AnomalyDetector = require('./utils/anomalyDetector');
const APITracker = require('./middleware/apiTracker');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL] 
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// API Tracker middleware (available on all routes)
app.use(APITracker.middleware());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/pricing', require('./routes/pricingRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));
app.use('/api/optimization', require('./routes/optimizationRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Cost Optimization Platform is running',
    timestamp: new Date().toISOString()
  });
});

// Example route showing how to use API tracker
app.post('/api/example/send-sms', async (req, res) => {
  try {
    // Track external API call using the middleware
    const result = await req.trackAPI({
      providerName: 'Twilio',
      endpointName: '/Messages',
      featureName: 'OTP Login',
      method: 'POST',
      url: 'https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT/Messages.json',
      data: {
        To: req.body.phone,
        From: '+1234567890',
        Body: 'Your OTP is: 123456'
      },
      headers: {
        'Authorization': 'Basic YOUR_AUTH_TOKEN'
      },
      requestCount: 1,
      logRequestBody: false
    });

    res.status(200).json({
      success: true,
      message: 'SMS sent successfully',
      cost: result.cost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send SMS',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start anomaly detection scheduler (runs every 5 minutes)
const ALERT_CHECK_INTERVAL = parseInt(process.env.ALERT_CHECK_INTERVAL) || 300000;
setInterval(async () => {
  console.log('Running anomaly detection checks...');
  await AnomalyDetector.runAllChecks();
}, ALERT_CHECK_INTERVAL);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
