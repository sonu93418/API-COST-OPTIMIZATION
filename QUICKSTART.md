# ⚡ Quick Start Guide

## Prerequisites Check

Before you begin, ensure you have:
- ✅ Node.js v16+ installed (`node --version`)
- ✅ MongoDB installed locally OR MongoDB Atlas account
- ✅ npm or yarn installed
- ✅ Git installed

---

## 🚀 Setup in 5 Minutes

### Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd API-COST-OPTIMIZATION

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment (1 minute)

**Backend Configuration:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/api_cost_optimization
JWT_SECRET=your_super_secure_secret_key_12345
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**Frontend Configuration:**
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 3: Start MongoDB (30 seconds)

**Option A: Local MongoDB**
```bash
# macOS
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### Step 4: Seed Sample Data (30 seconds)

```bash
cd backend
npm run seed
```

You should see:
```
✅ Seed data created successfully!

📝 Login Credentials:
Admin: admin@demo.com / password123
Developer: dev@demo.com / password123

📊 Sample Data:
- 5 Pricing Rules
- 1500 API Logs
- 3 Budgets
```

### Step 5: Start the Application (30 seconds)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Should see:
```
VITE v4.4.9  ready in 500 ms
➜  Local:   http://localhost:3000/
```

### Step 6: Login & Explore 🎉

1. Open browser: `http://localhost:3000`
2. Login with: `admin@demo.com` / `password123`
3. Explore the dashboard!

---

## 📱 First Time User Guide

### What to Check First

1. **Dashboard** - View cost trends and top expensive APIs
2. **API Logs** - See all tracked API calls
3. **Pricing Rules** - Check configured API costs
4. **Alerts** - View any anomalies detected
5. **Budgets** - Monitor spending limits
6. **Optimization** - Get cost-saving suggestions

### Admin Features (login as admin@demo.com)

- ✅ Create/Edit/Delete pricing rules
- ✅ Set monthly budgets
- ✅ Run anomaly detection manually
- ✅ Manage all alerts

### Developer Features (login as dev@demo.com)

- ✅ View analytics dashboard
- ✅ Browse API logs
- ✅ See optimization suggestions
- ✅ Mark alerts as read

---

## 🔧 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
# macOS
brew services list | grep mongodb

# Check connection string
echo $MONGODB_URI
```

### Issue: "Port 5000 already in use"
```bash
# Find and kill process on port 5000
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in backend/.env
PORT=5001
```

### Issue: "JWT token invalid"
```bash
# Clear browser localStorage
# Open browser console and run:
localStorage.clear()

# Then login again
```

### Issue: "No data showing in dashboard"
```bash
# Re-run seed script
cd backend
npm run seed
```

---

## 📊 Understanding the Sample Data

The seed script creates:

### Users
- **Admin**: Full access to all features
- **Developer**: Read-only access to analytics

### API Providers (with pricing)
- **Twilio** ($0.0075/request, 1000 free)
- **OpenAI** ($0.002/request, 0 free)
- **Google Maps** ($0.005/request, 2500 free)
- **Stripe** ($0.0001/request, 5000 free)
- **SendGrid** ($0.001/request, 10000 free)

### Sample Logs
- **1500 API calls** over past 30 days
- **Mix of success/failure** statuses
- **Various features**: OTP Login, Maps Search, AI Chatbot, etc.
- **Calculated costs** based on pricing rules

### Budgets
- **Twilio**: $500/month (80% alert)
- **OpenAI**: $1000/month (85% alert)
- **Google Maps**: $300/month (75% alert)

---

## 🎯 Next Steps

### Testing the API Tracker

Add this to `backend/server.js` to test tracking:

```javascript
// Example: Track a Twilio SMS
app.post('/api/test/send-sms', async (req, res) => {
  try {
    const result = await req.trackAPI({
      providerName: 'Twilio',
      endpointName: '/Messages',
      featureName: 'Test SMS',
      method: 'POST',
      url: 'https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT/Messages.json',
      data: { To: '+1234567890', Body: 'Test' },
      headers: { Authorization: 'Basic YOUR_TOKEN' },
      requestCount: 1
    });

    res.json({ success: true, cost: result.cost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

Test it:
```bash
curl -X POST http://localhost:5000/api/test/send-sms \
  -H "Content-Type: application/json"
```

### Customizing Pricing Rules

1. Login as admin
2. Go to "Pricing Rules"
3. Click "Add Pricing Rule"
4. Enter your API details:
   - Provider name
   - Cost per request
   - Free tier limit
5. Save

### Setting Up Budgets

1. Login as admin
2. Go to "Budgets"
3. Click "Add Budget"
4. Configure:
   - Provider name
   - Monthly limit ($)
   - Alert threshold (%)
5. Save

### Running Anomaly Detection

1. Login as admin
2. Go to "Alerts"
3. Click "Run Detection"
4. View generated alerts

---

## 🚀 Production Deployment

### Deploy Backend (Render)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create "New Web Service"
4. Connect GitHub repo
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables:
   - `MONGODB_URI` (from MongoDB Atlas)
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL` (your frontend URL)
7. Deploy!

### Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - `VITE_API_BASE_URL` (your backend URL)
5. Deploy!

---

## 📚 Additional Resources

- **README.md** - Full project documentation
- **ARCHITECTURE.md** - System architecture details
- **backend/server.js** - API tracker usage example
- **frontend/src/pages/** - UI component examples

---

## 🆘 Need Help?

### Check Logs

**Backend logs:**
```bash
cd backend
npm run dev
# Watch terminal for errors
```

**Frontend logs:**
```bash
# Open browser console (F12)
# Check for API errors
```

### Verify Database

```bash
# Connect to MongoDB
mongo

# Switch to database
use api_cost_optimization

# Check collections
show collections

# Count documents
db.users.count()
db.apilogs.count()
```

### Reset Everything

```bash
# Stop servers (Ctrl+C in terminals)

# Drop database
mongo
use api_cost_optimization
db.dropDatabase()

# Re-run seed
cd backend
npm run seed

# Restart servers
npm run dev
```

---

**🎉 Congratulations! Your API Cost Optimization Platform is ready!**

Start tracking your API costs and optimizing your spending today!
