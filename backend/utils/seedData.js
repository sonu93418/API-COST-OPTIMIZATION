require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PricingRule = require('../models/PricingRule');
const APILog = require('../models/ApiLog');
const Budget = require('../models/Budget');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await PricingRule.deleteMany({});
    await APILog.deleteMany({});
    await Budget.deleteMany({});

    // Create Users
    console.log('Creating users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: hashedPassword,
      role: 'admin',
      company: 'Demo Company'
    });

    const developer = await User.create({
      name: 'Developer User',
      email: 'dev@demo.com',
      password: hashedPassword,
      role: 'developer',
      company: 'Demo Company'
    });

    console.log('Users created');

    // Create Pricing Rules
    console.log('Creating pricing rules...');
    const pricingRules = await PricingRule.insertMany([
      {
        providerName: 'Twilio',
        costPerRequest: 0.0075,
        freeTierLimit: 1000,
        description: 'SMS and Voice API',
        currency: 'USD',
        billingCycle: 'per-request'
      },
      {
        providerName: 'OpenAI',
        costPerRequest: 0.002,
        freeTierLimit: 0,
        description: 'GPT-3.5 API calls',
        currency: 'USD',
        billingCycle: 'per-request'
      },
      {
        providerName: 'Google Maps',
        costPerRequest: 0.005,
        freeTierLimit: 2500,
        description: 'Maps Geocoding API',
        currency: 'USD',
        billingCycle: 'per-request'
      },
      {
        providerName: 'Stripe',
        costPerRequest: 0.0001,
        freeTierLimit: 5000,
        description: 'Payment Processing API',
        currency: 'USD',
        billingCycle: 'per-request'
      },
      {
        providerName: 'SendGrid',
        costPerRequest: 0.001,
        freeTierLimit: 10000,
        description: 'Email Delivery API',
        currency: 'USD',
        billingCycle: 'per-request'
      }
    ]);

    console.log('Pricing rules created');

    // Create Budgets
    console.log('Creating budgets...');
    const currentDate = new Date();
    const currentPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    await Budget.insertMany([
      {
        providerName: 'Twilio',
        monthlyLimit: 500,
        alertThreshold: 80,
        currentSpend: 0,
        period: currentPeriod
      },
      {
        providerName: 'OpenAI',
        monthlyLimit: 1000,
        alertThreshold: 85,
        currentSpend: 0,
        period: currentPeriod
      },
      {
        providerName: 'Google Maps',
        monthlyLimit: 300,
        alertThreshold: 75,
        currentSpend: 0,
        period: currentPeriod
      }
    ]);

    console.log('Budgets created');

    // Create Sample API Logs
    console.log('Creating sample API logs...');
    const features = [
      'OTP Login',
      'User Registration',
      'Password Reset',
      'Maps Search',
      'Location Finder',
      'AI Chatbot',
      'Content Generation',
      'Payment Processing',
      'Email Notification'
    ];

    const providers = ['Twilio', 'OpenAI', 'Google Maps', 'Stripe', 'SendGrid'];
    const endpoints = {
      'Twilio': ['/Messages', '/Calls', '/Verify'],
      'OpenAI': ['/v1/chat/completions', '/v1/completions', '/v1/embeddings'],
      'Google Maps': ['/geocode', '/directions', '/places'],
      'Stripe': ['/charges', '/customers', '/payment_intents'],
      'SendGrid': ['/mail/send', '/templates', '/contacts']
    };

    const logs = [];
    const now = new Date();

    // Generate logs for the past 30 days
    for (let day = 0; day < 30; day++) {
      const logsPerDay = Math.floor(Math.random() * 50) + 30;
      
      for (let i = 0; i < logsPerDay; i++) {
        const provider = providers[Math.floor(Math.random() * providers.length)];
        const endpoint = endpoints[provider][Math.floor(Math.random() * endpoints[provider].length)];
        const feature = features[Math.floor(Math.random() * features.length)];
        const status = Math.random() > 0.1 ? 'success' : 'failure';
        
        const logDate = new Date(now);
        logDate.setDate(logDate.getDate() - day);
        logDate.setHours(Math.floor(Math.random() * 24));
        logDate.setMinutes(Math.floor(Math.random() * 60));

        const pricingRule = pricingRules.find(p => p.providerName === provider);
        let calculatedCost = 0;
        
        if (status === 'success' && pricingRule) {
          calculatedCost = pricingRule.costPerRequest;
        }

        logs.push({
          providerName: provider,
          endpointName: endpoint,
          featureName: feature,
          requestCount: 1,
          responseTime: Math.floor(Math.random() * 2000) + 100,
          status,
          statusCode: status === 'success' ? 200 : 400,
          userId: Math.random() > 0.5 ? admin._id : developer._id,
          calculatedCost,
          createdAt: logDate,
          updatedAt: logDate
        });
      }
    }

    await APILog.insertMany(logs);
    console.log(`Created ${logs.length} sample API logs`);

    // Update budget current spend
    console.log('Updating budget spend...');
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    for (const provider of providers) {
      const totalSpend = await APILog.aggregate([
        {
          $match: {
            providerName: provider,
            createdAt: { $gte: monthStart }
          }
        },
        {
          $group: {
            _id: null,
            totalCost: { $sum: '$calculatedCost' }
          }
        }
      ]);

      if (totalSpend.length > 0) {
        await Budget.updateOne(
          { providerName: provider, period: currentPeriod },
          { currentSpend: totalSpend[0].totalCost }
        );
      }
    }

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: admin@demo.com / password123');
    console.log('Developer: dev@demo.com / password123');
    console.log('\n📊 Sample Data:');
    console.log(`- ${pricingRules.length} Pricing Rules`);
    console.log(`- ${logs.length} API Logs`);
    console.log('- 3 Budgets');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
