# 🚀 API Cost Optimization Platform - Deployment Guide

## 🎯 Production Deployment Stack
- **Backend API**: Render.com (Free)
- **Frontend Dashboard**: Vercel (Free)  
- **Database**: MongoDB Atlas (Free M0)
- **Domain**: Custom domain support available

---

## 📋 Pre-Deployment Checklist

### ✅ **1. Repository Ready**
- [x] All code committed to GitHub
- [x] render.yaml configured for backend
- [x] vercel.json configured for frontend
- [x] MongoDB Atlas IP whitelist updated

### ✅ **2. Environment Variables Required**

#### **Backend (Render.com)**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://yadavcpr2244_db_user:sonu%4093418@admin1.h7nbhyh.mongodb.net/apicost-optimization-platform?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
FRONTEND_URL=https://your-frontend-domain.vercel.app
PORT=4000
```

#### **Frontend (Vercel)**
```env
VITE_API_BASE_URL=https://your-backend-domain.onrender.com/api
```

---

## 🚀 Deployment Steps

### **Step 1: Deploy Backend to Render.com**

1. **Go to**: https://render.com
2. **Sign up/Login** with GitHub
3. **Click "New +"** → **"Web Service"**
4. **Connect Repository**: `sonu93418/API-COST-OPTIMIZATION`
5. **Configuration**:
   - **Name**: `api-cost-optimization-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. **Environment Variables**:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `[Your Atlas connection string]`
   - `JWT_SECRET` = `[Generate secure secret]`
   - `JWT_EXPIRE` = `7d`
   - `FRONTEND_URL` = `[Will update after frontend deployment]`

7. **Click "Create Web Service"**

### **Step 2: Configure MongoDB Atlas for Production**

1. **MongoDB Atlas Dashboard**: https://cloud.mongodb.com
2. **Network Access**: 
   - Add `0.0.0.0/0` (Allow from anywhere)
   - Or add Render.com IP ranges
3. **Database Access**: Ensure user has read/write privileges

### **Step 3: Deploy Frontend to Vercel**

1. **Go to**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import**: `sonu93418/API-COST-OPTIMIZATION`
5. **Configuration**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. **Environment Variables**:
   - `VITE_API_BASE_URL` = `https://api-cost-optimization-backend.onrender.com/api`

7. **Click "Deploy"**

### **Step 4: Update Cross-Origin Configuration**

1. **Get your Vercel domain** (e.g., `https://api-cost-optimization.vercel.app`)
2. **Update Render environment**:
   - `FRONTEND_URL` = `https://your-vercel-domain.vercel.app`
3. **Redeploy backend** to apply CORS changes

### **Step 5: Test Production Deployment**

#### **Backend API Tests**:
```bash
# Health check
curl https://api-cost-optimization-backend.onrender.com

# User registration
curl -X POST https://api-cost-optimization-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

#### **Frontend Dashboard**:
- Visit your Vercel domain
- Test user registration/login
- Verify API tracking functionality

---

## 🔧 Production Environment Setup

### **Database Configuration**
- ✅ MongoDB Atlas M0 (Free tier: 512MB storage)
- ✅ IP Whitelist: `0.0.0.0/0` (production access)
- ✅ Database User: Read/Write permissions

### **Backend Configuration**
- ✅ Render.com Free tier (750 hours/month)
- ✅ Auto-deploy from GitHub main branch
- ✅ Environment variables secured
- ✅ HTTPS certificates auto-generated

### **Frontend Configuration**  
- ✅ Vercel Free tier (100GB bandwidth/month)
- ✅ CDN optimization
- ✅ Auto-deploy from GitHub main branch
- ✅ Custom domain support available

---

## 📊 Production URLs

After deployment, your platform will be available at:

- **🎨 Dashboard**: `https://[your-project].vercel.app`
- **🔧 API**: `https://[your-project].onrender.com`
- **📖 Documentation**: Available in repository

---

## 🎯 Post-Deployment Tasks

### **1. Performance Optimization**
- [ ] Enable Vercel Analytics
- [ ] Configure Render auto-scaling
- [ ] Set up MongoDB Atlas monitoring

### **2. Security Enhancements**
- [ ] Rotate JWT secrets regularly
- [ ] Configure rate limiting
- [ ] Set up SSL certificate monitoring

### **3. Monitoring & Analytics**
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Enable application logging

---

## 🆘 Troubleshooting

### **Common Issues**

#### **Backend Deploy Fails**
```bash
# Check build logs in Render dashboard
# Verify environment variables
# Check MongoDB Atlas connectivity
```

#### **Frontend Build Fails**
```bash
# Verify VITE_API_BASE_URL is set
# Check build command in vercel.json
# Ensure dist folder is generated
```

#### **CORS Errors**
```bash
# Update FRONTEND_URL in backend env vars
# Redeploy backend after frontend URL is available
# Check Network tab in browser dev tools
```

---

## 🎊 Success! Your Platform is Live!

Once deployed, your **API Cost Optimization Platform** will be:

- 🌐 **Globally accessible** via HTTPS
- 📊 **Tracking real API costs** in production
- 🔐 **Secure** with proper authentication
- 📈 **Scalable** with auto-deployment
- 💰 **Cost-effective** on free tiers

**Share your live dashboard URL with users and start tracking API costs in production!**