# 🔐 Security & Database Configuration Guide

## ✅ **What Changed (February 8, 2026)**

### **1. Database Name Updated**
- **Old**: `api_cost_optimization` (generic)
- **New**: `apicost-optimization-platform` (professional, branded)

### **2. Security Upgrade: httpOnly Cookies Instead of localStorage**

#### **Why This Change?**
- ❌ **localStorage** is vulnerable to XSS (Cross-Site Scripting) attacks
- ✅ **httpOnly cookies** cannot be accessed by JavaScript, preventing token theft
- ✅ Added CSRF protection with `sameSite: 'strict'`
- ✅ Auto-expires cookies on logout

#### **Technical Changes:**

**Backend Changes:**
- Added `cookie-parser` middleware to handle cookies
- Modified auth controller to send tokens in httpOnly cookies
- Updated JWT middleware to read tokens from cookies OR headers
- Added logout endpoint to clear cookies
- Added `JWT_COOKIE_EXPIRE` environment variable

**Files Modified:**
- `backend/controllers/authController.js` - Added `sendTokenResponse()` function
- `backend/middleware/auth.js` - Now reads token from cookies
- `backend/routes/authRoutes.js` - Added logout route
- `backend/server.js` - Added cookie-parser middleware
- `backend/package.json` - Added cookie-parser dependency

---

## 📦 **Database Details**

### **Connection Information**
```env
DATABASE_NAME: apicost-optimization-platform
LOCAL_URI: mongodb://localhost:27017/apicost-optimization-platform
PRODUCTION_URI: mongodb+srv://user:pass@cluster.mongodb.net/apicost-optimization-platform
```

### **Collections (5 Total)**
1. **users** - User accounts (admin/developer)
2. **pricingrules** - API provider pricing configurations
3. **apilogs** - Historical API call records
4. **budgets** - Monthly spending limits
5. **alerts** - Anomaly and budget alerts

---

## 👥 **User Accounts (Demo)**

### **Admin Account**
```
Email: admin@demo.com
Password: password123
Role: admin
Permissions:
  - View all data
  - Create/Edit/Delete pricing rules
  - Create/Edit/Delete budgets
  - Run anomaly detection
  - Update budget spend
  - Full CRUD access
```

### **Developer Account**
```
Email: dev@demo.com
Password: password123
Role: developer
Permissions:
  - View dashboards
  - View logs
  - View pricing rules (read-only)
  - View budgets (read-only)
  - View alerts
  - View optimization suggestions
  - No create/edit/delete permissions
```

---

## 💰 **Pricing Rules (5 Providers)**

| Provider    | Cost/Request | Free Tier | Description           |
|-------------|--------------|-----------|------------------------|
| Twilio      | $0.0075      | 1,000     | SMS and Voice API      |
| OpenAI      | $0.0020      | 0         | GPT-3.5 API calls      |
| Google Maps | $0.0050      | 2,500     | Maps Geocoding API     |
| Stripe      | $0.0001      | 5,000     | Payment Processing API |
| SendGrid    | $0.0010      | 10,000    | Email Delivery API     |

---

## 💳 **Monthly Budgets (3 Providers)**

| Provider    | Monthly Limit | Alert Threshold | Current Period |
|-------------|---------------|-----------------|----------------|
| Twilio      | $500          | 80%             | 2026-02        |
| OpenAI      | $1,000        | 85%             | 2026-02        |
| Google Maps | $300          | 75%             | 2026-02        |

**Alert Logic:**
- Alert triggered when `(currentSpend / monthlyLimit) * 100 >= alertThreshold`
- Example: Twilio alerts at $400 (80% of $500)

---

## 📊 **Sample Data Generated**

### **API Logs**
- **Total**: ~1,500-1,600 logs
- **Date Range**: Last 30 days
- **Providers**: 5 (Twilio, OpenAI, Google Maps, Stripe, SendGrid)
- **Features**: 9 types
  - OTP Login
  - User Registration
  - Password Reset
  - Maps Search
  - Location Finder
  - AI Chatbot
  - Content Generation
  - Payment Processing
  - Email Notification
- **Success Rate**: ~90%
- **Cost Distribution**: Realistic based on pricing rules

---

## 🔒 **Security Features**

### **Authentication**
✅ JWT tokens with 7-day expiration  
✅ httpOnly cookies (not accessible via JavaScript)  
✅ Secure flag (HTTPS-only in production)  
✅ sameSite: 'strict' (CSRF protection)  
✅ Password hashing with bcrypt (10 salt rounds)  

### **Authorization**
✅ Role-based access control (RBAC)  
✅ Protected routes with middleware  
✅ Admin-only endpoints  
✅ Token validation on every request  

### **Data Protection**
✅ Environment variables for sensitive data  
✅ MongoDB connection string not exposed  
✅ No passwords stored in plain text  
✅ Input validation with express-validator  

---

## 🚀 **How to Use**

### **1. Install Dependencies**
```bash
cd backend
npm install
```

### **2. Configure Environment**
```bash
# Copy example file
cp .env.example .env

# Edit .env
nano .env

# Update these values:
MONGODB_URI=mongodb://localhost:27017/apicost-optimization-platform
JWT_SECRET=your_super_secure_secret_here
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
```

### **3. Seed Database**
```bash
npm run seed
```

**Expected Output:**
```
========================================
   API COST OPTIMIZATION PLATFORM
   Database Seeding Process Started
========================================

📦 Database Name: apicost-optimization-platform
📍 MongoDB URI: mongodb://localhost:27017/apicost-optimization-platform

... (detailed seeding process)

✅ DATABASE SEEDING COMPLETED!
```

### **4. Start Servers**
```bash
# Backend
cd backend
npm start

# Frontend (new terminal)
cd frontend
npm run dev
```

### **5. Login**
```
URL: http://localhost:3000
Email: admin@demo.com
Password: password123
```

---

## 🔧 **Environment Variables**

### **Backend (.env)**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# Database Name: apicost-optimization-platform
MONGODB_URI=mongodb://localhost:27017/apicost-optimization-platform

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# CORS
FRONTEND_URL=http://localhost:3000

# Alert Configuration
ALERT_SPIKE_THRESHOLD=3
ALERT_CHECK_INTERVAL=300000

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📋 **Migration Guide (If Upgrading)**

### **From Old Database to New**

**Option 1: Fresh Start (Recommended)**
```bash
# Just re-seed the new database
npm run seed
```

**Option 2: Migrate Existing Data**
```javascript
// Connect to old database
use api_cost_optimization

// Export collections
mongoexport --db=api_cost_optimization --collection=users --out=users.json
mongoexport --db=api_cost_optimization --collection=apilogs --out=logs.json
mongoexport --db=api_cost_optimization --collection=pricingrules --out=pricing.json

// Import to new database
mongoimport --db=apicost-optimization-platform --collection=users --file=users.json
mongoimport --db=apicost-optimization-platform --collection=apilogs --file=logs.json
mongoimport --db=apicost-optimization-platform --collection=pricingrules --file=pricing.json
```

---

## 🧪 **Testing the Changes**

### **Test 1: Database Connection**
```bash
# Check if new database exists
mongo
> show dbs
> use apicost-optimization-platform
> show collections
```

### **Test 2: Cookie Authentication**
```bash
# Login and check cookie
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"password123"}' \
  -c cookies.txt

# Use cookie for authenticated request
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt
```

### **Test 3: Logout**
```bash
# Logout (clears cookie)
curl -X GET http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

---

## 📊 **Database Statistics**

After seeding, you'll have:
- **2** user accounts
- **5** pricing rules
- **~1,500-1,600** API logs
- **3** monthly budgets
- **0** alerts (generated dynamically)

**Total Size**: ~500KB - 1MB

---

## 🔍 **Verification Commands**

```bash
# Check database exists
mongo apicost-optimization-platform --eval "db.stats()"

# Count documents
mongo apicost-optimization-platform --eval "db.users.count()"
mongo apicost-optimization-platform --eval "db.apilogs.count()"
mongo apicost-optimization-platform --eval "db.pricingrules.count()"

# View admin user
mongo apicost-optimization-platform --eval "db.users.findOne({email:'admin@demo.com'})"
```

---

## 🚨 **Important Notes**

### **For Development:**
✅ Use demo credentials  
✅ httpOnly cookies work with localhost  
✅ MongoDB can run locally  

### **For Production:**
⚠️ Change all demo passwords  
⚠️ Use strong JWT secret (64+ characters)  
⚠️ Use MongoDB Atlas for database  
⚠️ Enable HTTPS (cookies secure flag)  
⚠️ Update FRONTEND_URL to production domain  
⚠️ Set NODE_ENV=production  

---

## 💡 **Benefits of These Changes**

1. **Security** ⬆️
   - httpOnly cookies prevent XSS attacks
   - CSRF protection with sameSite
   - Professional security practices

2. **Branding** ⬆️
   - Professional database name
   - Better organization
   - Clearer purpose

3. **User Experience** ⬆️
   - Detailed seed output
   - Clear account information
   - Better debugging info

4. **Maintainability** ⬆️
   - Better documentation
   - Clearer code structure
   - Easier to understand

---

## 📞 **Support**

If you encounter issues:
1. Check MongoDB is running: `mongod --version`
2. Check Node.js version: `node --version` (should be v16+)
3. Verify .env file exists and has correct values
4. Check logs for detailed error messages
5. Re-run seed script: `npm run seed`

---

**Last Updated**: February 8, 2026  
**Database Name**: apicost-optimization-platform  
**Security Level**: Production-Ready  
**Authentication**: httpOnly Cookies + JWT  
