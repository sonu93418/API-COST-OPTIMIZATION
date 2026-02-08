require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Simple in-memory setup for demo
console.log('🚀 Starting Local Demo Server...');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple test data store (for demo)
let apiLogs = [];
let users = [{ id: '1', name: 'Demo User', email: 'demo@example.com' }];

// Routes for demo
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API Cost Optimization Platform - Local Demo', users: users.length, logs: apiLogs.length });
});

app.post('/api/logs', (req, res) => {
  const log = { id: Date.now(), timestamp: new Date(), ...req.body };
  apiLogs.push(log);
  console.log('📊 New API Log:', log.apiProvider, log.cost);
  res.json({ success: true, log, totalLogs: apiLogs.length });
});

app.get('/api/logs', (req, res) => {
  res.json({ success: true, logs: apiLogs, total: apiLogs.length });
});

app.post('/api/auth/register', (req, res) => {
  const user = { id: Date.now(), ...req.body };
  users.push(user);
  res.json({ success: true, user, message: 'User registered successfully' });
});

// Analytics endpoint  
app.get('/api/analytics/summary', (req, res) => {
  const totalCost = apiLogs.reduce((sum, log) => sum + (log.cost || 0), 0);
  const providers = [...new Set(apiLogs.map(log => log.apiProvider))];
  
  res.json({
    success: true,
    summary: {
      totalApiCalls: apiLogs.length,
      totalCost: totalCost.toFixed(4),
      providers: providers.length,
      topProvider: providers[0] || 'None'
    }
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log('✅ Server running on port', PORT);
  console.log('🎯 Demo mode - ready for API tracking!');
  console.log('📊 Dashboard: http://localhost:3000');
  console.log('🔗 API: http://localhost:5001');
});