# 📐 System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              React Frontend (Port 3000)                 │    │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────────────┐ │    │
│  │  │  Pages   │  │ Components│  │  Context (Auth)     │ │    │
│  │  └──────────┘  └──────────┘  └─────────────────────┘ │    │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────────────┐ │    │
│  │  │ Services │  │  Routing  │  │  State Management   │ │    │
│  │  └──────────┘  └──────────┘  └─────────────────────┘ │    │
│  └────────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/REST (Axios)
                            │ JWT Bearer Token
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API GATEWAY LAYER                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           Express.js Server (Port 5000)                │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐  │    │
│  │  │            Middleware Stack                     │  │    │
│  │  │  • CORS                                         │  │    │
│  │  │  • JSON Parser                                  │  │    │
│  │  │  • Morgan (Logging)                            │  │    │
│  │  │  • API Tracker (Custom)                        │  │    │
│  │  └─────────────────────────────────────────────────┘  │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐  │    │
│  │  │              Route Handlers                     │  │    │
│  │  │  • /api/auth          (Public)                 │  │    │
│  │  │  • /api/analytics     (Protected)              │  │    │
│  │  │  • /api/pricing       (Protected/Admin)        │  │    │
│  │  │  • /api/alerts        (Protected)              │  │    │
│  │  │  • /api/budgets       (Protected/Admin)        │  │    │
│  │  │  • /api/optimization  (Protected)              │  │    │
│  │  └─────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              MongoDB Database                          │    │
│  │  ┌──────────────────────────────────────────────────┐ │    │
│  │  │  Collections:                                    │ │    │
│  │  │  • users           (Authentication & RBAC)       │ │    │
│  │  │  • apilogs         (API call tracking)           │ │    │
│  │  │  • pricingrules    (Cost configuration)          │ │    │
│  │  │  • budgets         (Monthly limits)              │ │    │
│  │  │  • alerts          (Notifications)               │ │    │
│  │  └──────────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

### 1. User Authentication Flow
```
User Browser
    │
    ├─→ POST /api/auth/login (email, password)
    │       │
    │       ├─→ authController.login()
    │       │       │
    │       │       ├─→ Find user in DB
    │       │       ├─→ Compare password (bcrypt)
    │       │       └─→ Generate JWT token
    │       │
    │       └─→ Return { token, user }
    │
    └─→ Store token in localStorage
        │
        └─→ All subsequent requests include:
            Authorization: Bearer <token>
```

### 2. API Tracking Flow
```
Application Service
    │
    ├─→ req.trackAPI({
    │       providerName: 'Twilio',
    │       endpointName: '/Messages',
    │       featureName: 'OTP Login',
    │       url: 'https://api.twilio.com/...',
    │       data: { ... }
    │   })
    │       │
    │       ├─→ APITracker.track()
    │       │       │
    │       │       ├─→ Record start time
    │       │       ├─→ Execute external API call (axios)
    │       │       ├─→ Calculate response time
    │       │       │
    │       │       ├─→ CostCalculator.calculateCost()
    │       │       │       │
    │       │       │       ├─→ Fetch PricingRule from DB
    │       │       │       ├─→ Check free tier usage
    │       │       │       └─→ Return calculated cost
    │       │       │
    │       │       └─→ Save APILog to MongoDB
    │       │
    │       └─→ Return { success, data, cost, responseTime }
```

### 3. Dashboard Analytics Flow
```
User Dashboard
    │
    ├─→ GET /api/analytics/dashboard?startDate=...&endDate=...
    │       │
    │       ├─→ Auth Middleware (verify JWT)
    │       │       │
    │       │       └─→ req.user populated
    │       │
    │       ├─→ analyticsController.getDashboard()
    │       │       │
    │       │       ├─→ Aggregate total metrics
    │       │       │   (totalCost, totalRequests, successRate)
    │       │       │
    │       │       ├─→ CostCalculator.getCostByProvider()
    │       │       │   (Group by provider, sum costs)
    │       │       │
    │       │       ├─→ CostCalculator.getCostByFeature()
    │       │       │   (Group by feature, sum costs)
    │       │       │
    │       │       └─→ CostCalculator.getDailyCostTrend()
    │       │           (Group by day, sum costs)
    │       │
    │       └─→ Return aggregated dashboard data
    │
    └─→ Render charts and metrics
```

### 4. Anomaly Detection Flow
```
Background Scheduler (Every 5 minutes)
    │
    ├─→ AnomalyDetector.runAllChecks()
    │       │
    │       ├─→ detectSpikes()
    │       │       │
    │       │       ├─→ Get last hour usage by provider
    │       │       ├─→ Get past 24h average usage
    │       │       ├─→ Calculate increase ratio
    │       │       └─→ If ratio >= 3x: Create Alert
    │       │
    │       ├─→ checkBudgets()
    │       │       │
    │       │       ├─→ Fetch all active budgets
    │       │       ├─→ Compare currentSpend vs monthlyLimit
    │       │       └─→ If >= threshold: Create Alert
    │       │
    │       └─→ detectHighErrorRates()
    │               │
    │               ├─→ Get last hour error rate by provider
    │               └─→ If errorRate >= 20%: Create Alert
    │
    └─→ Alerts displayed in UI
```

### 5. Optimization Engine Flow
```
User Views Optimization Page
    │
    ├─→ GET /api/optimization/suggestions?days=7
    │       │
    │       ├─→ OptimizationEngine.generateSuggestions()
    │       │       │
    │       │       ├─→ detectCacheableRequests()
    │       │       │   (Find repeated API calls >100 times)
    │       │       │   Suggestion: "Cache responses to save 70%"
    │       │       │
    │       │       ├─→ detectRateLimitOpportunities()
    │       │       │   (Find bursty usage patterns)
    │       │       │   Suggestion: "Implement rate limiting"
    │       │       │
    │       │       ├─→ detectBatchOpportunities()
    │       │       │   (Find >10 calls/minute)
    │       │       │   Suggestion: "Use batch API endpoints"
    │       │       │
    │       │       ├─→ detectDuplicateCalls()
    │       │       │   (Find identical requests)
    │       │       │   Suggestion: "Remove duplicate calls"
    │       │       │
    │       │       └─→ detectPerformanceIssues()
    │       │           (Find slow APIs >2s)
    │       │           Suggestion: "Optimize payload or use pagination"
    │       │
    │       └─→ Return prioritized suggestions with impact analysis
    │
    └─→ Display suggestions grouped by priority
```

## Data Flow Diagram

```
┌───────────┐          ┌──────────────┐         ┌─────────────┐
│  Browser  │          │  Express API │         │   MongoDB   │
│           │          │              │         │             │
│  React UI │          │   Node.js    │         │  Database   │
└─────┬─────┘          └──────┬───────┘         └──────┬──────┘
      │                       │                        │
      │  1. Login Request     │                        │
      │──────────────────────>│                        │
      │                       │  2. Verify User        │
      │                       │───────────────────────>│
      │                       │                        │
      │                       │  3. User Data          │
      │                       │<───────────────────────│
      │  4. JWT Token         │                        │
      │<──────────────────────│                        │
      │                       │                        │
      │  5. Get Dashboard     │                        │
      │  (with JWT)           │                        │
      │──────────────────────>│                        │
      │                       │  6. Aggregate Logs     │
      │                       │───────────────────────>│
      │                       │                        │
      │                       │  7. Analytics Data     │
      │                       │<───────────────────────│
      │  8. Render Charts     │                        │
      │<──────────────────────│                        │
      │                       │                        │
```

## Technology Stack Details

### Frontend Stack
```
React 18.2.0
├── react-router-dom 6.16.0  (Routing)
├── axios 1.5.0               (HTTP Client)
├── recharts 2.8.0            (Charts)
├── lucide-react 0.284.0      (Icons)
└── tailwindcss 3.3.3         (Styling)

Build Tool: Vite 4.4.9
```

### Backend Stack
```
Node.js + Express 4.18.2
├── mongoose 7.5.0            (MongoDB ODM)
├── jsonwebtoken 9.0.2        (JWT Auth)
├── bcryptjs 2.4.3            (Password Hashing)
├── express-validator 7.0.1   (Input Validation)
├── cors 2.8.5                (CORS)
├── morgan 1.10.0             (Logging)
└── dotenv 16.3.1             (Environment Variables)
```

### Database
```
MongoDB 7.x
├── Collections: 5
├── Indexes: Compound indexes on frequently queried fields
└── Aggregation Pipelines for analytics
```

## Security Architecture

```
┌─────────────────────────────────────────────────┐
│           Security Layers                        │
├─────────────────────────────────────────────────┤
│  1. HTTPS (Production)                          │
│     └─→ All traffic encrypted                   │
│                                                  │
│  2. CORS Configuration                          │
│     └─→ Only allowed origins                    │
│                                                  │
│  3. JWT Authentication                          │
│     └─→ Signed tokens with expiration           │
│                                                  │
│  4. Password Hashing                            │
│     └─→ Bcrypt with salt rounds = 10            │
│                                                  │
│  5. Role-Based Access Control                   │
│     └─→ Admin vs Developer permissions          │
│                                                  │
│  6. Input Validation                            │
│     └─→ Express-validator on all inputs         │
│                                                  │
│  7. Environment Variables                       │
│     └─→ Secrets not in source code              │
└─────────────────────────────────────────────────┘
```

## Scalability Considerations

### Current Architecture (Single Server)
- Handles up to 10,000 API logs/day
- Dashboard queries optimized with indexes
- Response time: <100ms for most queries

### Future Scalability (High Volume)
```
Load Balancer
    │
    ├─→ API Server 1
    ├─→ API Server 2
    └─→ API Server N
         │
         ├─→ MongoDB Replica Set (Primary + Secondary)
         ├─→ Redis Cache (for frequent queries)
         └─→ Message Queue (for async processing)
```

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│          Production Stack                │
├─────────────────────────────────────────┤
│  Frontend: Vercel/Netlify               │
│  └─→ CDN Distribution                   │
│  └─→ Automatic HTTPS                    │
│                                          │
│  Backend: Render/Railway/Heroku         │
│  └─→ Auto-scaling                       │
│  └─→ Health checks                      │
│                                          │
│  Database: MongoDB Atlas                │
│  └─→ Automated backups                  │
│  └─→ Point-in-time recovery             │
│  └─→ Connection pooling                 │
└─────────────────────────────────────────┘
```
