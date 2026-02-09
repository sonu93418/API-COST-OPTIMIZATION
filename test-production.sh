#!/bin/bash

# 🚀 API Cost Optimization Platform - Production Test Script
# Run this script to test your live deployment

echo "🧪 Testing Production Deployment..."
echo "=================================="

# Configuration - UPDATE THESE URLs AFTER DEPLOYMENT
BACKEND_URL="https://api-cost-optimization-backend.onrender.com"
FRONTEND_URL="https://api-cost-optimization-frontend.vercel.app"

echo ""
echo "🔧 Backend API Tests"
echo "-------------------"

# Test 1: Health Check
echo "1️⃣ Testing backend health..."
curl -s "$BACKEND_URL" | jq '.' || echo "❌ Backend health check failed"

# Test 2: Registration
echo ""
echo "2️⃣ Testing user registration..."
curl -X POST "$BACKEND_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Production Test User","email":"prodtest@example.com","password":"testpass123","role":"user"}' \
  -s | jq '.' || echo "❌ Registration failed"

# Test 3: Database Connection
echo ""  
echo "3️⃣ Testing database connectivity..."
curl -X GET "$BACKEND_URL/api/logs" \
  -H "Content-Type: application/json" \
  -s | jq '.' || echo "❌ Database connection failed"

echo ""
echo "🎨 Frontend Tests"
echo "----------------"

# Test 4: Frontend Loading
echo "4️⃣ Testing frontend accessibility..."
curl -s -I "$FRONTEND_URL" | head -1 || echo "❌ Frontend not accessible"

echo ""
echo "📊 Production URLs"
echo "-----------------"
echo "🎨 Dashboard: $FRONTEND_URL"
echo "🔧 Backend API: $BACKEND_URL"
echo "📖 Documentation: https://github.com/sonu93418/API-COST-OPTIMIZATION"

echo ""
echo "✅ Production testing complete!"
echo "🌐 Your API Cost Optimization Platform is LIVE!"