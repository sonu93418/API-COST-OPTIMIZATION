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

    console.log('\n========================================');
    console.log('   API COST OPTIMIZATION PLATFORM');
    console.log('   Database Seeding Process Started');
    console.log('========================================\n');

    console.log('📦 Database Name: apicost-optimization-platform');
    console.log(`📍 MongoDB URI: ${process.env.MONGODB_URI}\n`);

    // Clear existing data
    console.log('🗑️  Step 1: Clearing existing data...');
    const deletedUsers = await User.deleteMany({});
    const deletedPricing = await PricingRule.deleteMany({});
    const deletedLogs = await APILog.deleteMany({});
    const deletedBudgets = await Budget.deleteMany({});
    console.log(`   ✓ Deleted ${deletedUsers.deletedCount} users`);
    console.log(`   ✓ Deleted ${deletedPricing.deletedCount} pricing rules`);
    console.log(`   ✓ Deleted ${deletedLogs.deletedCount} API logs`);
    console.log(`   ✓ Deleted ${deletedBudgets.deletedCount} budgets\n`);

    // Create Users
    console.log('👥 Step 2: Creating demo users...');
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

    console.log('   ✓ Admin Account Created');
    console.log('     - Email: admin@demo.com');
    console.log('     - Password: password123');
    console.log('     - Role: admin');
    console.log('     - ID:', admin._id.toString());
    console.log('   ✓ Developer Account Created');
    console.log('     - Email: dev@demo.com');
    console.log('     - Password: password123');
    console.log('     - Role: developer');
    console.log('     - ID:', developer._id.toString());
    console.log('');

    // Create Pricing Rules
    console.log('💰 Step 3: Creating API pricing rules...');
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

    console.log('   ✓ Created 5 pricing rules:');
    pricingRules.forEach(rule => {
      console.log(`     - ${rule.providerName}: $${rule.costPerRequest}/request (Free tier: ${rule.freeTierLimit})`);
    });
    console.log('');

    // Create Budgets
    console.log('💳 Step 4: Creating budget limits...');
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

    console.log(`   ✓ Created 3 monthly budgets for period: ${currentPeriod}`);
    console.log('     - Twilio: $500 (Alert at 80%)');
    console.log('     - OpenAI: $1000 (Alert at 85%)');
    console.log('     - Google Maps: $300 (Alert at 75%)\n');

    // Create Sample API Logs
    console.log('📊 Step 5: Creating sample API logs...');
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
    console.log(`   ✓ Created ${logs.length} API logs across 30 days`);
    console.log('     - Providers: Twilio, OpenAI, Google Maps, Stripe, SendGrid');
    console.log('     - Features: OTP Login, User Registration, AI Chatbot, etc.');
    console.log(`     - Success Rate: ~${Math.round((logs.filter(l => l.status === 'success').length / logs.length) * 100)}%\n`);

    // Update budget current spend
    console.log('💸 Step 6: Calculating and updating budget spend...');
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
        const spend = totalSpend[0].totalCost;
        await Budget.updateOne(
          { providerName: provider, period: currentPeriod },
          { currentSpend: spend }
        );
        console.log(`   ✓ Updated ${provider} budget: $${spend.toFixed(2)}`);
      }
    }

    console.log('\n========================================');
    console.log('   ✅ DATABASE SEEDING COMPLETED!');
    console.log('========================================\n');
    
    console.log('📦 Database Details:');
    console.log(`   Name: apicost-optimization-platform`);
    console.log(`   Connection: ${process.env.MONGODB_URI.replace(/\/\/.*@/, '//***@')}\n`);
    
    console.log('👥 User Accounts (Total: 2):');
    console.log('   ┌─────────────────────────────────────┐');
    console.log('   │ 🔑 ADMIN ACCOUNT                    │');
    console.log('   ├─────────────────────────────────────┤');
    console.log('   │ Email: admin@demo.com               │');
    console.log('   │ Password: password123               │');
    console.log('   │ Role: admin (Full Access)           │');
    console.log('   └─────────────────────────────────────┘');
    console.log('   ┌─────────────────────────────────────┐');
    console.log('   │ 👤 DEVELOPER ACCOUNT                │');
    console.log('   ├─────────────────────────────────────┤');
    console.log('   │ Email: dev@demo.com                 │');
    console.log('   │ Password: password123               │');
    console.log('   │ Role: developer (Read-only)         │');
    console.log('   └─────────────────────────────────────┘\n');
    
    console.log('💰 Pricing Rules (Total: 5):');
    pricingRules.forEach((rule, i) => {
      console.log(`   ${i + 1}. ${rule.providerName.padEnd(15)} $${rule.costPerRequest.toString().padEnd(7)} Free: ${rule.freeTierLimit} requests`);
    });
    console.log('');
    
    console.log('💳 Monthly Budgets (Total: 3):');
    const budgets = await Budget.find({ period: currentPeriod });
    for (const budget of budgets) {
      const percentage = ((budget.currentSpend / budget.monthlyLimit) * 100).toFixed(1);
      console.log(`   - ${budget.providerName.padEnd(15)} $${budget.currentSpend.toFixed(2).padStart(7)} / $${budget.monthlyLimit} (${percentage}%)`);
    }
    console.log('');
    
    console.log(`📊 API Logs (Total: ${logs.length}):   `);
    console.log(`   - Date Range: Last 30 days`);
    console.log(`   - Providers: 5 (Twilio, OpenAI, Google Maps, Stripe, SendGrid)`);
    console.log(`   - Features: 9 types`);
    const successCount = logs.filter(l => l.status === 'success').length;
    console.log(`   - Success Rate: ${((successCount / logs.length) * 100).toFixed(1)}%\n`);
    
    console.log('🚀 Next Steps:');
    console.log('   1. Start backend: npm start');
    console.log('   2. Start frontend: npm run dev');
    console.log('   3. Login at: http://localhost:3000');
    console.log('   4. Use credentials above\n');
    
    console.log('📚 Security Notes:');
    console.log('   - JWT tokens stored in httpOnly cookies (not localStorage)');
    console.log('   - Passwords hashed with bcrypt (10 salt rounds)');
    console.log('   - Change demo passwords in production\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
