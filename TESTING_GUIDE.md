# 🧪 Live API Testing Guide

This guide shows you how to test your API Cost Optimization Platform with real data flowing through your dashboard.

## 🚀 Quick Start

### 1. **Start the Backend Server**
```bash
cd backend
npm run dev
```
Server will start on `http://localhost:5000`

### 2. **Start the Frontend**
```bash
cd frontend  
npm run dev
```
Frontend will start on `http://localhost:3000`

### 3. **Seed Initial Data** (Optional but recommended)
```bash
cd backend
npm run seed
```
This creates:
- Admin user: `admin@demo.com` / `password123`
- Developer user: `dev@demo.com` / `password123` 
- Pricing rules for all APIs
- Sample budgets

## 🎯 Testing Options

### **Option 1: Single Test (Recommended for first time)**
```bash
cd backend
npm run test-single
```
**What it does:**
- Tests each API provider once (Twilio, OpenAI, Google Maps, Stripe, SendGrid)  
- Takes ~10 seconds to complete
- Generates 5 API call records
- Perfect for seeing basic dashboard functionality

### **Option 2: High Volume Test**
```bash
cd backend
npm run test-volume
```
**What it does:**
- Generates 50 API calls rapidly
- Tests all providers with random scenarios
- Takes ~30 seconds to complete
- Shows dashboard with rich data

### **Option 3: Live Continuous Testing** 
```bash
cd backend
npm run test-live
```
**What it does:**
- Runs continuous API calls every 1-5 seconds
- Mix of single calls and bulk operations
- Real-time data flowing into dashboard
- Press `Ctrl+C` to stop
- Great for demos and presentations

## 📊 What You'll See in Dashboard

After running tests, login to your dashboard and you'll see:

### **Dashboard Analytics:**
- 💰 **Total API costs** accumulating in real-time
- 📈 **API call trends** by hour/day
- 🏆 **Top expensive APIs** ranking
- 📋 **Success/failure rates** 
- ⚡ **Average response times**

### **API Logs Page:**
- 📝 Real-time API call entries
- 🔍 Filter by provider, status, date
- 💰 Individual costs per API call
- ⏱️ Response times and timestamps

### **Budget Alerts:**
- 🚨 Threshold warnings when costs approach limits
- 📊 Current spend vs monthly budget
- 📈 Spending trend analysis

### **Optimization Suggestions:**
- 💡 AI-powered cost reduction tips
- 📉 Performance improvement recommendations  
- 🎯 Priority-based action items

## 🎨 Test Scenarios Included

### **Twilio SMS/Voice:**
- User notifications
- Customer support calls
- Phone verification 
- Marketing campaigns
- **Cost:** $0.0075/request  

### **OpenAI GPT:**
- Chatbot responses
- Content generation
- Code analysis
- Translation services
- **Cost:** $0.002/request

### **Google Maps:**
- Delivery tracking
- Store locator
- Route optimization
- Address validation  
- **Cost:** $0.005/request

### **Stripe Payments:**
- Checkout processing
- Subscription billing
- Customer management
- Refund handling
- **Cost:** $0.0001/request

### **SendGrid Email:**
- Welcome emails
- Order confirmations  
- Password resets
- Newsletter campaigns
- **Cost:** $0.001/request

## 💡 Pro Tips

### **For Best Results:**
1. **Start with single test** first to see basic functionality
2. **Open dashboard in browser** before running tests
3. **Refresh dashboard** to see new data appear
4. **Try different filters** in the dashboard (by provider, date, etc.)
5. **Check the "Logs" page** for detailed API call records

### **Demo Scenarios:**
- Run `test-live` during presentations
- Use `test-volume` to show dashboard with lots of data  
- Use `test-single` for quick functionality checks
- Login as admin vs developer to show role differences

### **Troubleshooting:**
- Ensure MongoDB is running
- Check `.env` file has correct database URL
- Backend server must be running on port 5000
- Frontend must be running on port 3000
- Check browser console for any errors

## 🌟 Expected Results

After running tests, you should see:
- ✅ API calls logged in real-time
- ✅ Costs calculated automatically  
- ✅ Dashboard charts populating with data
- ✅ Budget tracking active
- ✅ Success/failure metrics updating
- ✅ Optimization suggestions appearing

---

**🎉 Your API Cost Optimization Platform is now live with real data!** 

Check your dashboard at: `http://localhost:3000/dashboard`