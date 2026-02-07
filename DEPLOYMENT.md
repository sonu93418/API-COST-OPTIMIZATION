# 🚀 Production Deployment Guide

Complete step-by-step guide to deploy API Cost Optimization Platform to production.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] GitHub account (for code hosting)
- [ ] MongoDB Atlas account (free tier available)
- [ ] Vercel account (for frontend) - Free
- [ ] Render account (for backend) - Free tier available
- [ ] Domain name (optional, Vercel provides free subdomain)

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Verify email

### 1.2 Create Cluster
```
1. Click "Build a Database"
2. Choose "Free" tier (M0 Sandbox)
3. Select cloud provider: AWS
4. Select region: Closest to your users
5. Cluster name: "api-cost-optimization"
6. Click "Create Cluster"
```

### 1.3 Create Database User
```
1. Go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Username: admin
4. Password: Generate secure password (save it!)
5. Built-in Role: "Read and write to any database"
6. Click "Add User"
```

### 1.4 Configure Network Access
```
1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   Note: For production, restrict to specific IPs
4. Click "Confirm"
```

### 1.5 Get Connection String
```
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Driver: Node.js
4. Version: 4.1 or later
5. Copy connection string:
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
6. Replace <password> with your actual password
7. Add database name: /api_cost_optimization
   Final: mongodb+srv://admin:password@cluster0.xxxxx.mongodb.net/api_cost_optimization?retryWrites=true&w=majority
```

✅ **Save this connection string - you'll need it for backend deployment**

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 2.2 Create Web Service
```
1. Dashboard → Click "New +"
2. Select "Web Service"
3. Connect your GitHub repository: API-COST-OPTIMIZATION
4. If not listed, click "Configure Account" and grant access
```

### 2.3 Configure Service
```
Name: api-cost-optimization-backend
Region: Oregon (or closest to your users)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### 2.4 Set Environment Variables
Click "Advanced" → "Add Environment Variable":

```env
NODE_ENV=production
PORT=5000

MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/api_cost_optimization?retryWrites=true&w=majority

JWT_SECRET=<Generate using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
JWT_EXPIRE=7d

FRONTEND_URL=https://your-frontend.vercel.app
(Note: Update this after deploying frontend)

ALERT_SPIKE_THRESHOLD=3
ALERT_CHECK_INTERVAL=300000
```

### 2.5 Deploy
```
1. Click "Create Web Service"
2. Wait 3-5 minutes for deployment
3. Your backend URL: https://api-cost-optimization-backend.onrender.com
```

### 2.6 Seed Database (One-time)
```
1. In Render dashboard → Shell tab
2. Run: npm run seed
3. Verify output shows "✅ Seed data created successfully!"
```

✅ **Save your backend URL - you'll need it for frontend**

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel

### 3.2 Import Project
```
1. Dashboard → "Add New..." → "Project"
2. Import Git Repository
3. Select: API-COST-OPTIMIZATION
4. If not listed, adjust GitHub App Permissions
```

### 3.3 Configure Project
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3.4 Set Environment Variables
Add Environment Variable:

```env
VITE_API_URL=https://api-cost-optimization-backend.onrender.com/api
```

### 3.5 Deploy
```
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your frontend URL: https://api-cost-optimization.vercel.app
```

### 3.6 Update Backend CORS
```
1. Go back to Render dashboard
2. Environment → Edit FRONTEND_URL
3. Set: https://api-cost-optimization.vercel.app
4. Save changes (will redeploy automatically)
```

✅ **Your app is now live!**

---

## 🔒 Step 4: Security Hardening

### 4.1 Update Default Credentials
```bash
# Connect to MongoDB Atlas via MongoDB Compass or Shell
# Delete demo users or change passwords

# Or via backend Shell in Render:
node -e "
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect(process.env.MONGODB_URI);
const User = require('./models/User');
User.updateOne(
  { email: 'admin@demo.com' },
  { password: bcrypt.hashSync('NEW_SECURE_PASSWORD', 10) }
).then(() => console.log('Updated'));
"
```

### 4.2 Restrict MongoDB Network Access
```
1. MongoDB Atlas → Network Access
2. Remove "Allow Access from Anywhere"
3. Add specific Render IP addresses
   (Get from Render documentation)
```

### 4.3 Enable HTTPS (Already enabled by Vercel/Render)
✅ Both platforms provide free SSL certificates

### 4.4 Set Up Custom Domain (Optional)
```
Vercel:
1. Settings → Domains
2. Add your domain
3. Update DNS records as instructed

Render:
1. Settings → Custom Domain
2. Add backend domain
3. Update DNS records
```

---

## 📊 Step 5: Monitoring & Maintenance

### 5.1 Enable Render Monitoring
```
1. Render Dashboard → Metrics
2. Monitor:
   - CPU usage
   - Memory usage
   - Response times
   - Error rates
```

### 5.2 Set Up MongoDB Monitoring
```
1. MongoDB Atlas → Metrics
2. Enable alerts for:
   - High connection count
   - Disk space usage
   - Query performance
```

### 5.3 Enable Vercel Analytics (Optional)
```
1. Vercel Dashboard → Analytics
2. Enable Real User Monitoring
3. Track page views and performance
```

### 5.4 Regular Backups
```
MongoDB Atlas:
1. Go to "Backup" tab
2. Enable Cloud Backups
3. Set retention period: 7 days
```

---

## 🧪 Step 6: Testing Production Deployment

### 6.1 Test Frontend
```
1. Open: https://your-app.vercel.app
2. Should see login page
3. Check browser console - no errors
4. Test responsive design
```

### 6.2 Test Backend API
```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Login test
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"password123"}'
```

### 6.3 Test Full Flow
```
1. Login with demo credentials
2. Navigate to Dashboard
3. Check if data loads
4. Test filters
5. Navigate to all pages
6. Test CRUD operations (if admin)
7. Logout and re-login
```

---

## 🚨 Troubleshooting

### Issue: "Cannot connect to database"
```
Solution:
1. Check MongoDB connection string
2. Verify database user password
3. Check Network Access whitelist
4. Ensure database name is correct
```

### Issue: "CORS error"
```
Solution:
1. Verify FRONTEND_URL in backend env vars
2. Should match exact Vercel URL (with https://)
3. No trailing slash
4. Redeploy backend after change
```

### Issue: "API calls fail from frontend"
```
Solution:
1. Check VITE_API_URL in Vercel
2. Should end with /api
3. Verify backend is deployed and running
4. Check browser network tab for errors
```

### Issue: "Render service sleeping"
```
Solution:
- Free tier sleeps after 15 min inactivity
- Wakes up on first request (30s delay)
- Upgrade to paid plan for 24/7 uptime
- Or use cron-job.org to ping every 10 minutes
```

---

## 💰 Cost Breakdown

### Free Tier (Recommended for MVP)
```
MongoDB Atlas:    $0/month (512MB storage)
Render:           $0/month (750 hours/month)
Vercel:           $0/month (Unlimited bandwidth)
Total:            $0/month ✅
```

### Paid Tier (For Production Scale)
```
MongoDB Atlas:    $9/month (M10 cluster)
Render:           $7/month (Always on)
Vercel:           $20/month (Pro features)
Total:            $36/month
```

---

## 📈 Scaling Considerations

### When to Scale?

**Database:**
- Storage > 400MB → Upgrade MongoDB tier
- Connections > 100 → Add replica set
- Queries > 1M/month → Add indexes

**Backend:**
- Response time > 1s → Upgrade Render plan
- CPU > 80% → Add more instances
- Memory > 90% → Increase RAM

**Frontend:**
- Traffic > 100GB/month → Monitor costs
- Page load > 3s → Optimize bundle size
- Multiple regions needed → Add CDN

---

## ✅ Launch Checklist

Before announcing your platform:

- [ ] All environment variables set correctly
- [ ] Default passwords changed
- [ ] MongoDB backups enabled
- [ ] HTTPS working on all domains
- [ ] CORS configured properly
- [ ] Error logging set up
- [ ] Monitoring dashboards active
- [ ] Documentation updated with live URLs
- [ ] README badges updated
- [ ] Demo credentials documented
- [ ] Support email configured
- [ ] GitHub issues enabled
- [ ] License file present
- [ ] Security policy published

---

## 🎉 Post-Deployment

### Share Your Work
```
1. Update README with live demo link
2. Add badges for deployment status
3. Share on:
   - LinkedIn
   - Twitter
   - Reddit (r/webdev, r/node)
   - Dev.to
   - Hacker News
4. Add to portfolio website
```

### Gather Feedback
```
1. Share with developer communities
2. Ask for feature requests
3. Fix bugs reported
4. Iterate and improve
```

---

## 📞 Support

- **Deployment Issues**: [GitHub Issues](https://github.com/sonu93418/API-COST-OPTIMIZATION/issues)
- **MongoDB Help**: [MongoDB Docs](https://docs.mongodb.com)
- **Render Help**: [Render Docs](https://render.com/docs)
- **Vercel Help**: [Vercel Docs](https://vercel.com/docs)

---

**🎊 Congratulations! Your API Cost Optimization Platform is now LIVE in production! 🎊**

Access your platform at:
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.onrender.com
- **Database**: MongoDB Atlas Dashboard
