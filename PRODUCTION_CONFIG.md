# 🌐 Production Environment Variables for Deployment

## 🔧 Backend (Render.com) Environment Variables

### Required Environment Variables:
NODE_ENV=production
MONGODB_URI=mongodb+srv://yadavcpr2244_db_user:sonu%4093418@admin1.h7nbhyh.mongodb.net/apicost-optimization-platform?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_here_change_in_production_2026
JWT_EXPIRE=7d  
JWT_COOKIE_EXPIRE=7
FRONTEND_URL=https://your-frontend-app.vercel.app
PORT=4000

## 🎨 Frontend (Vercel) Environment Variables

### Required Environment Variables:
VITE_API_BASE_URL=https://api-cost-optimization-backend.onrender.com/api

---

## 📋 Deployment Checklist

### ✅ Backend Deployment (Render.com)
- [ ] Sign up at https://render.com
- [ ] Connect GitHub repository: sonu93418/API-COST-OPTIMIZATION  
- [ ] Set Root Directory: backend
- [ ] Configure environment variables above
- [ ] Deploy and get backend URL

### ✅ Frontend Deployment (Vercel)
- [ ] Sign up at https://vercel.com
- [ ] Connect GitHub repository: sonu93418/API-COST-OPTIMIZATION
- [ ] Set Root Directory: frontend  
- [ ] Configure VITE_API_BASE_URL with backend URL
- [ ] Deploy and get frontend URL

### ✅ Final Configuration
- [ ] Update FRONTEND_URL in backend with Vercel URL
- [ ] Test registration and login functionality
- [ ] Verify API tracking works in production

---

## 🚀 Quick Deploy Commands

### Test Backend After Deployment:
```bash
curl https://your-backend.onrender.com
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Test Frontend After Deployment:
- Visit: https://your-frontend.vercel.app
- Test user registration
- Verify dashboard functionality

---

## 🔗 Live URLs (Update after deployment)

- **Dashboard**: https://[your-app].vercel.app
- **API**: https://[your-app].onrender.com  
- **Repository**: https://github.com/sonu93418/API-COST-OPTIMIZATION

Your complete API Cost Optimization Platform will be live and accessible worldwide! 🌍