# 🔧 MongoDB Setup Instructions

Choose one of the following MongoDB setup options:

## Option 1: Use Local MongoDB (Recommended for Development)

### Install MongoDB Locally:
**Windows:**
```bash
# Download and install MongoDB Community Server from:
# https://www.mongodb.com/try/download/community

# Or use Chocolatey:
choco install mongodb

# Or use winget:
winget install MongoDB.Server
```

**After Installation:**
1. **Start MongoDB service:**
   ```bash
   # Windows Service (automatic)
   net start MongoDB
   
   # Or run manually:
   mongod --dbpath C:\data\db
   ```

2. **Update your .env file:**
   ```env
   # Comment out cloud MongoDB
   # MONGODB_URI=mongodb+srv://yadavcpr2244_db_user:sonu%4093418@admin1.h7nbhyh.mongodb.net/apicost-optimization-platform?retryWrites=true&w=majority
   
   # Use local MongoDB
   MONGODB_URI=mongodb://localhost:27017/apicost-optimization-platform
   ```

## Option 2: Use Docker MongoDB (Easy Setup)

```bash
# Pull and run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Update .env to use local connection
MONGODB_URI=mongodb://localhost:27017/apicost-optimization-platform
```

## Option 3: Free Cloud MongoDB Atlas

1. **Create free account:** https://www.mongodb.com/atlas/database
2. **Create free cluster** (512MB free tier)
3. **Get connection string** and update .env:
   ```env
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/apicost-optimization-platform?retryWrites=true&w=majority
   ```

## Option 4: Use MongoDB Compass (GUI)

1. **Download:** https://www.mongodb.com/products/compass
2. **Connect to:** `mongodb://localhost:27017`
3. **Create database:** `apicost-optimization-platform`

## ✅ Test Your Connection

After setting up MongoDB, test it:
```bash
cd backend
node test-db.js
```

## 🚀 Quick Start (No MongoDB Install Needed)

If you want to get started immediately without installing MongoDB:

```bash
# Use MongoDB in memory (for testing only)
npm install mongodb-memory-server --save-dev
```

Then I can modify your app to use in-memory MongoDB for development.

---

**Which option would you prefer?**
- **Local MongoDB** - Best for development  
- **Docker MongoDB** - Easiest setup
- **Cloud Atlas** - No local install needed
- **In-Memory** - Quick testing only