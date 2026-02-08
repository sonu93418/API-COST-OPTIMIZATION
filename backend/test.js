require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

// Connect to MongoDB first
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/api-cost-optimization');
    console.log('✅ MongoDB Connected for Live Testing');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Import models and utilities after connection
let APITracker, APILog;

// Test Configuration
const TEST_USER_ID = '507f1f77bcf86cd799439011'; // Mock user ID
const TEST_SERVICE = 'live-test-service';

/**
 * Simulate Various API Call Scenarios
 */
class LiveAPITester {
  
  constructor() {
    this.isRunning = false;
    this.callCount = 0;
  }

  // Random delay between API calls (1-5 seconds)
  randomDelay() {
    return Math.floor(Math.random() * 4000) + 1000;
  }

  // Generate random response time (50-2000ms)
  randomResponseTime() {
    return Math.floor(Math.random() * 1950) + 50;
  }

  /**
   * Simulate Twilio SMS API calls
   */
  async testTwilioAPI() {
    const scenarios = [
      { endpoint: 'send-sms', feature: 'user-notifications', success: true },
      { endpoint: 'voice-call', feature: 'customer-support', success: true },
      { endpoint: 'verify-phone', feature: 'user-registration', success: false }, // Simulate failure
      { endpoint: 'send-sms', feature: 'marketing-campaigns', success: true }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    try {
      console.log(`📱 Testing Twilio - ${scenario.feature}`);
      
      if (scenario.success) {
        const result = await APITracker.track({
          providerName: 'Twilio',
          endpointName: scenario.endpoint,
          featureName: scenario.feature,
          url: 'https://httpbin.org/status/200', // Mock successful response
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: { to: '+1234567890', body: 'Test message' },
          userId: TEST_USER_ID,
          serviceIdentifier: TEST_SERVICE,
          requestCount: 1,
          timeout: 5000
        });
        console.log(`   ✅ Success - Cost: $${result.cost}, Time: ${result.responseTime}ms`);
      } else {
        // Simulate API failure
        await APITracker.track({
          providerName: 'Twilio',
          endpointName: scenario.endpoint,
          featureName: scenario.feature,
          url: 'https://httpbin.org/status/429', // Rate limit error
          method: 'POST',
          userId: TEST_USER_ID,
          serviceIdentifier: TEST_SERVICE,
          requestCount: 1,
          timeout: 5000
        });
      }
    } catch (error) {
      console.log(`   ❌ Failed - ${error.message}`);
    }
  }

  /**
   * Simulate OpenAI API calls
   */
  async testOpenAIAPI() {
    const features = ['chatbot', 'content-generation', 'code-analysis', 'translation'];
    const feature = features[Math.floor(Math.random() * features.length)];
    
    try {
      console.log(`🤖 Testing OpenAI - ${feature}`);
      
      const result = await APITracker.track({
        providerName: 'OpenAI',
        endpointName: 'chat-completions',
        featureName: feature,
        url: 'https://httpbin.org/delay/1', // Simulate processing time
        method: 'POST',
        headers: { 'Authorization': 'Bearer sk-test' },
        data: { 
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Test prompt' }],
          max_tokens: 100
        },
        userId: TEST_USER_ID,
        serviceIdentifier: TEST_SERVICE,
        requestCount: 1,
        timeout: 10000
      });
      
      console.log(`   ✅ Success - Cost: $${result.cost}, Time: ${result.responseTime}ms`);
    } catch (error) {
      console.log(`   ❌ Failed - ${error.message}`);
    }
  }

  /**
   * Simulate Google Maps API calls
   */
  async testGoogleMapsAPI() {
    const endpoints = ['geocoding', 'directions', 'places', 'distance-matrix'];
    const features = ['delivery-tracking', 'store-locator', 'route-optimization', 'address-validation'];
    
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const feature = features[Math.floor(Math.random() * features.length)];
    
    try {
      console.log(`🗺️  Testing Google Maps - ${feature}`);
      
      const result = await APITracker.track({
        providerName: 'Google Maps',
        endpointName: endpoint,
        featureName: feature,
        url: 'https://httpbin.org/json', // Mock JSON response
        method: 'GET',
        params: { address: 'New York, NY', key: 'API_KEY' },
        userId: TEST_USER_ID,
        serviceIdentifier: TEST_SERVICE,
        requestCount: 1,
        timeout: 5000
      });
      
      console.log(`   ✅ Success - Cost: $${result.cost}, Time: ${result.responseTime}ms`);
    } catch (error) {
      console.log(`   ❌ Failed - ${error.message}`);
    }
  }

  /**
   * Simulate Stripe Payment API calls
   */
  async testStripeAPI() {
    const endpoints = ['create-payment', 'refund', 'customer', 'subscription'];
    const features = ['checkout', 'billing', 'user-management', 'subscription-service'];
    
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const feature = features[Math.floor(Math.random() * features.length)];
    
    try {
      console.log(`💳 Testing Stripe - ${feature}`);
      
      const result = await APITracker.track({
        providerName: 'Stripe',
        endpointName: endpoint,
        featureName: feature,
        url: 'https://httpbin.org/status/200',
        method: 'POST',
        headers: { 'Authorization': 'Bearer sk_test_123' },
        data: { amount: 2000, currency: 'usd' },
        userId: TEST_USER_ID,
        serviceIdentifier: TEST_SERVICE,
        requestCount: 1,
        timeout: 5000
      });
      
      console.log(`   ✅ Success - Cost: $${result.cost}, Time: ${result.responseTime}ms`);
    } catch (error) {
      console.log(`   ❌ Failed - ${error.message}`);
    }
  }

  /**
   * Simulate SendGrid Email API calls
   */
  async testSendGridAPI() {
    const features = ['welcome-emails', 'order-confirmations', 'password-reset', 'newsletters'];
    const feature = features[Math.floor(Math.random() * features.length)];
    
    try {
      console.log(`📧 Testing SendGrid - ${feature}`);
      
      const result = await APITracker.track({
        providerName: 'SendGrid',
        endpointName: 'send-email',
        featureName: feature,
        url: 'https://httpbin.org/status/202', // Email accepted
        method: 'POST',
        headers: { 'Authorization': 'Bearer SG.test' },
        data: {
          personalizations: [{ to: [{ email: 'test@example.com' }] }],
          from: { email: 'noreply@demo.com' },
          subject: 'Test Email'
        },
        userId: TEST_USER_ID,
        serviceIdentifier: TEST_SERVICE,
        requestCount: 1,
        timeout: 5000
      });
      
      console.log(`   ✅ Success - Cost: $${result.cost}, Time: ${result.responseTime}ms`);
    } catch (error) {
      console.log(`   ❌ Failed - ${error.message}`);
    }
  }

  /**
   * Simulate bulk API operations
   */
  async testBulkOperations() {
    console.log('📊 Testing Bulk Operations...');
    
    const bulkPromises = [
      this.testTwilioAPI(),
      this.testOpenAIAPI(),
      this.testGoogleMapsAPI(),
      this.testStripeAPI(),
      this.testSendGridAPI()
    ];

    await Promise.allSettled(bulkPromises);
    console.log('   ✅ Bulk operations completed');
  }

  /**
   * Start continuous testing
   */
  async startLiveTesting() {
    console.log('\n🚀 STARTING LIVE API TESTING');
    console.log('=====================================');
    console.log('This will generate real API call data for your dashboard');
    console.log('Press Ctrl+C to stop testing\n');

    this.isRunning = true;

    const testMethods = [
      this.testTwilioAPI.bind(this),
      this.testOpenAIAPI.bind(this),
      this.testGoogleMapsAPI.bind(this),
      this.testStripeAPI.bind(this),
      this.testSendGridAPI.bind(this)
    ];

    while (this.isRunning) {
      try {
        this.callCount++;
        console.log(`\n--- Test Call #${this.callCount} ---`);
        
        // Random test selection
        if (Math.random() < 0.3) {
          // 30% chance for bulk operations
          await this.testBulkOperations();
        } else {
          // 70% chance for single API call
          const randomTest = testMethods[Math.floor(Math.random() * testMethods.length)];
          await randomTest();
        }

        // Random delay between tests
        const delay = this.randomDelay();
        console.log(`⏳ Waiting ${delay}ms before next test...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
      } catch (error) {
        console.error(`❌ Test error:`, error.message);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  /**
   * Stop testing
   */
  stop() {
    console.log('\n🛑 Stopping live testing...');
    this.isRunning = false;
  }

  /**
   * Generate high-volume test data
   */
  async generateHighVolumeData() {
    console.log('\n⚡ GENERATING HIGH VOLUME TEST DATA');
    console.log('=====================================');
    
    const promises = [];
    for (let i = 0; i < 50; i++) {
      const delay = Math.floor(Math.random() * 3000); // 0-3 second delay
      
      promises.push(
        new Promise(async (resolve) => {
          setTimeout(async () => {
            try {
              const testMethods = [
                this.testTwilioAPI.bind(this),
                this.testOpenAIAPI.bind(this),
                this.testGoogleMapsAPI.bind(this),
                this.testStripeAPI.bind(this),
                this.testSendGridAPI.bind(this)
              ];
              
              const randomTest = testMethods[Math.floor(Math.random() * testMethods.length)];
              await randomTest();
              resolve();
            } catch (error) {
              console.error(`High volume test error:`, error.message);
              resolve();
            }
          }, delay);
        })
      );
    }
    
    await Promise.allSettled(promises);
    console.log('✅ High volume test data generated (50 API calls)');
  }
}

// Main execution
const main = async () => {
  await connectDB();
  
  // Load modules after DB connection
  APITracker = require('./middleware/apiTracker');
  APILog = require('./models/ApiLog');
  
  const tester = new LiveAPITester();
  
  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    tester.stop();
    console.log('\n👋 Live testing stopped. Data should be visible in dashboard!');
    console.log('📊 Check your dashboard at: http://localhost:3000/dashboard');
    process.exit(0);
  });

  // Parse command line arguments
  const args = process.argv.slice(2);
  
  if (args.includes('--high-volume')) {
    await tester.generateHighVolumeData();
    console.log('\n📊 Check your dashboard at: http://localhost:3000/dashboard');
    process.exit(0);
  } else if (args.includes('--single-test')) {
    console.log('🧪 Running single test of each API...');
    await tester.testTwilioAPI();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await tester.testOpenAIAPI();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await tester.testGoogleMapsAPI();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await tester.testStripeAPI();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await tester.testSendGridAPI();
    
    console.log('\n✅ Single test completed!');
    console.log('📊 Check your dashboard at: http://localhost:3000/dashboard');
    process.exit(0);
  } else {
    // Start continuous testing
    await tester.startLiveTesting();
  }
};

// Start the testing
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});