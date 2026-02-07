# 📘 Complete User Guide - API Cost Optimization Platform

This guide covers everything you need to know to use the platform effectively, from registration to advanced features.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Registration & Login](#registration--login)
- [Dashboard Overview](#dashboard-overview)
- [API Logs & Live Monitoring](#api-logs--live-monitoring)
- [Test Logger (Real API Tracking)](#test-logger-real-api-tracking)
- [Pricing Rules](#pricing-rules)
- [Budgets](#budgets)
- [Alerts](#alerts)
- [Optimization Tips](#optimization-tips)
- [Profile Management](#profile-management)
- [Multi-User Access](#multi-user-access)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### First Time Setup

1. **Access Application**
   - Open browser: http://localhost:3000
   - Or your deployed URL: https://your-app.vercel.app

2. **Choose Path**
   - **New User?** → Click "Create Account"
   - **Existing User?** → Use "Sign In"
   - **Testing?** → Use demo credentials

3. **Demo Accounts** (Pre-configured for testing)
   ```
   Admin Account:
   Email: admin@demo.com
   Password: password123
   
   Developer Account:
   Email: dev@demo.com
   Password: password123
   ```

---

## 🔐 Registration & Login

### Creating New Account

1. **Click "Create Account"** on login page

2. **Fill Registration Form**
   - **Name**: Your full name
   - **Email**: Valid email address (used for login)
   - **Company**: Your company name (REQUIRED)
   - **Password**: Minimum 6 characters
   - **Confirm Password**: Must match

3. **Click "Sign Up"**
   - Account created instantly
   - Automatically logged in
   - Redirected to Dashboard

4. **Your Role**
   - First user: Admin role (full access)
   - Additional users: Developer role (view-only initially)

### Logging In

1. **Enter Credentials**
   - Email address
   - Password

2. **Quick Access Options**
   - Click "Admin Demo" → Fills admin credentials
   - Click "Developer Demo" → Fills developer credentials
   - Show/Hide password toggle (eye icon)

3. **Successful Login**
   - Redirected to Dashboard
   - Session stored securely (7 days)
   - Welcome message with your name

### Password Security
- Minimum 6 characters recommended
- Passwords are encrypted (bcrypt)
- Stored securely in database
- Use strong, unique passwords

---

## 📊 Dashboard Overview

The Dashboard is your command center showing real-time cost analytics.

### Top Statistics (4 Cards)

**1. Total Cost**
- Current month spending
- All API providers combined
- Updates in real-time
- Color: Purple gradient with $ icon

**2. Total Requests**
- Number of API calls this month
- All providers and features
- Activity indicator
- Color: Blue gradient with bar chart icon

**3. Active Providers**
- Number of unique API providers used
- Example: OpenAI, Anthropic, Google
- Color: Green gradient with users icon

**4. Success Rate**
- Percentage of successful API calls
- Formula: (successful / total) × 100%
- Shows reliability
- Color: Orange gradient with check icon

### Charts Section

**Cost Trends (Line Chart)**
- Last 30 days of spending
- Daily cost breakdown
- Hover to see exact amounts
- Identify spending spikes
- Plan future budgets

**Cost by Provider (Pie Chart)**
- Visual breakdown by API provider
- Color-coded segments
- Shows % of total spending
- Click legend to hide/show providers
- Compare provider costs

### Recent Expenses Table

Shows 10 most expensive API calls:
- **Provider**: API service (OpenAI, Google, etc.)
- **Feature**: Model/service (GPT-4, Gemini, etc.)
- **Requests**: Number of calls
- **Tokens**: Total tokens used (input + output)
- **Response Time**: Average latency in ms
- **Cost**: Total cost in USD
- **Status**: Success/Failed badge (color-coded)

### Refresh Data
- Click **Refresh** button (top-right)
- Reloads all dashboard data
- Spinning icon during load
- Use after making test API calls

---

## 📝 API Logs & Live Monitoring

View detailed history of all API calls with real-time updates.

### Viewing Logs

**Navigation**: Click "API Logs" in sidebar

**Log Entry Details**:
- **Timestamp**: Exact date and time of call
- **Provider**: API service (OpenAI, Anthropic, Google, Hugging Face)
- **Endpoint**: API URL called
- **Feature**: Model or service name (GPT-4, Claude-3.5-Sonnet, Gemini-Pro)
- **Status**: Success (green), Failed (red), Error (yellow)
- **Response Time**: Latency in milliseconds
- **Cost**: Calculated cost in USD

### Live Monitoring 🔥 NEW FEATURE

Watch API calls appear in real-time without refreshing!

**How to Use**:

1. **Start Monitoring**
   - Click **"Start Live Monitor"** button (top-right)
   - Button turns green
   - Shows "Live Mode ON"

2. **What Happens**
   - Auto-refreshes every 5 seconds
   - New calls highlighted in green
   - Counter shows "+X new calls"
   - Last update timestamp displayed
   - Green banner shows "Live Monitoring Active"

3. **During Live Mode**
   - Keep page open
   - New calls appear automatically
   - Green highlighting for new entries
   - Works with filters (see below)

4. **Stop Monitoring**
   - Click **"Stop Live Monitor"**
   - Button returns to normal color
   - Auto-refresh stops
   - Manual refresh still available

**Live Monitor Use Cases**:
- ✅ Testing API integrations
- ✅ Debugging API issues
- ✅ Monitoring production traffic
- ✅ Demonstrating to clients
- ✅ Watching cost accumulation

### Filtering Logs

**Filter Options**:

1. **By Provider**
   - Select provider from dropdown
   - Options: All, OpenAI, Anthropic, Google, Hugging Face, Azure
   - Shows only calls to that provider

2. **By Feature**
   - Select feature/model from dropdown
   - Options: All, GPT-4, Claude-3.5-Sonnet, Gemini-Pro, etc.
   - Shows only calls to that model

3. **By Status**
   - Select status from dropdown
   - Options: All, Success, Failed, Error
   - Filter by call outcome

**Combining Filters**:
- Use multiple filters together
- Example: OpenAI + GPT-4 + Success
- Works with live monitoring
- Reset by selecting "All"

### Pagination

- **Results per page**: 10 logs
- **Navigation**: Previous/Next buttons
- **Current page**: Displayed in pagination
- **Total logs**: Shows total count
- **Works with filters**: Pagination updates when filtering

### Clear All Logs

Remove all logs (useful after testing):

1. Click **"Clear All"** button (red, top-right)
2. Confirm deletion warning
3. All logs deleted from database
4. Fresh start with clean slate

**When to use**:
- After testing with seeded data
- Starting new billing period
- Clearing test logs
- Privacy requirements

---

## ⚡ Test Logger (Real API Tracking)

Log real API calls manually or automatically track them in your code.

### Manual Logging (Testing)

**Navigation**: Click "Test Logger" in sidebar (⚡ icon)

**Step-by-Step**:

1. **Fill Form Fields**

   **Provider Name** (Required)
   - Your API provider
   - Examples: OpenAI, Anthropic, Google, Hugging Face, Azure
   - Type any provider name

   **Feature/Model** (Required)
   - Model or service name
   - Examples: GPT-4, Claude-3.5-Sonnet, Gemini-Pro, BERT
   - Type any feature name

   **Endpoint** (Required)
   - API endpoint path
   - Examples: /v1/chat/completions, /v1/messages
   - Include the full path

   **Method** (Required)
   - HTTP method
   - Options: POST, GET, PUT, DELETE
   - Usually POST for AI models

   **Input Tokens** (Optional)
   - Number of input tokens
   - Example: 150
   - Leave blank if not applicable

   **Output Tokens** (Optional)
   - Number of output tokens
   - Example: 100
   - Leave blank if not applicable

   **Response Time** (Optional)
   - Time in milliseconds
   - Example: 1200
   - Leave blank if unknown

   **Status**
   - Success or Failed
   - Default: Success

2. **Submit**
   - Click **"Log API Call"** button
   - Green success message appears
   - Automatically calculates cost from pricing rules

3. **View Result**
   - Go to "API Logs" page
   - See your logged call at the top
   - Turn on "Live Monitor" to watch more calls

4. **Generate Random** (Testing)
   - Click **"Generate Random"** button
   - Auto-fills form with sample data
   - Random provider, tokens, timing
   - Great for testing

### Automatic Tracking (Production)

Integrate into your actual code to track real API calls:

```javascript
// Import the tracking function
import { trackAPICall } from './services/apiLogService';

// Example: OpenAI Integration
const callOpenAI = async (userMessage) => {
  const result = await trackAPICall(
    'OpenAI',                    // Provider name
    '/v1/chat/completions',      // Endpoint
    'POST',                       // HTTP method
    'GPT-4',                      // Model name
    async () => {
      // Your actual API call goes here
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: userMessage }]
        })
      });
      
      return await response.json();
    }
  );
  
  // The function automatically logs:
  // ✓ Timestamp
  // ✓ Token usage (from result.usage)
  // ✓ Response time (calculated)
  // ✓ Cost (from pricing rules)
  // ✓ Success/failure status
  
  return result;
};
```

**Integration Examples** (see `frontend/src/examples/realAPIIntegration.js`):
- OpenAI (GPT-4, embeddings)
- Anthropic (Claude-3.5-Sonnet)
- Google (Gemini-Pro)
- Hugging Face (BERT, other models)
- Custom APIs

### Cost Calculation

**How It Works**:
1. You log API call with token counts
2. System finds pricing rule for provider/feature
3. Calculates: (inputTokens × inputCost/1k) + (outputTokens × outputCost/1k)
4. Displays cost in dashboard and logs

**Example**:
- Provider: OpenAI, Feature: GPT-4
- Input: 150 tokens, Output: 100 tokens
- Pricing: $0.03/1k input, $0.06/1k output
- Cost = (150 × 0.03/1000) + (100 × 0.06/1000) = $0.0105

---

## 💰 Pricing Rules

Configure cost per 1K tokens for each provider and model.

### Viewing Pricing Rules

**Navigation**: Click "Pricing Rules" in sidebar

**Display**:
- Table showing all pricing rules
- Columns: Provider, Feature, Input Cost, Output Cost
- Color-coded by provider
- Search bar to filter rules

### Adding New Pricing Rule (Admin Only)

1. **Click** "Add Pricing Rule" button

2. **Fill Form**:
   - **Provider Name**: OpenAI, Anthropic, Google, etc.
   - **Feature Name**: GPT-4, Claude-3.5-Sonnet, Gemini-Pro, etc.
   - **Input Cost per 1K Tokens**: Cost in USD (e.g., 0.03)
   - **Output Cost per 1K Tokens**: Cost in USD (e.g., 0.06)

3. **Click** "Save"

4. **Result**: New pricing rule active immediately

### Editing Pricing Rule (Admin Only)

1. **Click** "Edit" on any rule
2. **Modify** values
3. **Click** "Save"
4. All future cost calculations use new pricing

### Deleting Pricing Rule (Admin Only)

1. **Click** "Delete" on any rule
2. **Confirm** deletion
3. Rule removed (cannot undo)

### Common Pricing Examples

**OpenAI**:
- GPT-4: $0.03 input / $0.06 output per 1K
- GPT-3.5-Turbo: $0.001 input / $0.002 output per 1K
- text-embedding-ada-002: $0.0001 per 1K

**Anthropic**:
- Claude-3.5-Sonnet: $0.003 input / $0.015 output per 1K
- Claude-3-Opus: $0.015 input / $0.075 output per 1K

**Google**:
- Gemini-Pro: $0.00025 input / $0.0005 output per 1K

---

## 💵 Budgets

Set spending limits and track progress.

### Viewing Budgets

**Navigation**: Click "Budgets" in sidebar

**Display**:
- Cards for each budget
- Progress bars showing % used
- Amount spent vs. limit
- Time period (monthly/weekly/daily)
- Color: Green (safe), Yellow (warning), Red (exceeded)

### Creating Budget (Admin Only)

1. **Click** "Create Budget" button

2. **Fill Form**:
   - **Name**: Budget description (e.g., "Monthly OpenAI Budget")
   - **Amount**: Limit in USD (e.g., 1000)
   - **Period**: Monthly, Weekly, or Daily
   - **Start Date**: When budget starts

3. **Click** "Create"

4. **Result**: Budget active immediately

### Budget Tracking

**Automatic Updates**:
- Real-time tracking of spending
- Updates with every API call logged
- Progress bar shows % of budget used
- Visual warnings when approaching limit

**Status Indicators**:
- **Green (0-70%)**: Safe spending level
- **Yellow (70-90%)**: Warning, approaching limit
- **Red (90-100%)**: Danger, at or over limit

### Budget Alerts

When you reach threshold (default 80%):
- Alert created automatically
- Visible in "Alerts" page
- Email notification (if configured)
- Dashboard shows warning

### Editing/Deleting Budget (Admin Only)

1. **Click** "Edit" or "Delete" on budget card
2. **Modify** values or confirm deletion
3. **Save** changes

---

## 🔔 Alerts

Manage cost notifications and anomaly detection.

### Viewing Alerts

**Navigation**: Click "Alerts" in sidebar

**Alert Types**:
- **Threshold Alerts**: Cost exceeded daily/weekly/monthly limit
- **Anomaly Alerts**: Unusual usage spike detected
- **Budget Alerts**: Budget limit reached

**Alert Information**:
- **Type**: Threshold, Anomaly, or Budget
- **Message**: Description of issue
- **Threshold**: Limit that was exceeded
- **Actual Value**: Current spending
- **Status**: Active, Resolved, Dismissed
- **Timestamp**: When alert triggered

### Creating Alert (Admin Only)

1. **Click** "Create Alert" button

2. **Configure**:
   - **Type**: Threshold or Anomaly
   - **Threshold Amount**: USD limit
   - **Period**: Daily, Weekly, or Monthly
   - **Email Notification**: Enable/disable

3. **Click** "Create"

4. **How It Works**:
   - System checks spending automatically
   - Triggers when threshold exceeded
   - Creates alert entry
   - Sends email (if enabled)

### Managing Alerts

**Resolve Alert**:
- Click "Resolve" on alert
- Marks as resolved
- Alert remains in history

**Dismiss Alert**:
- Click "Dismiss" on alert
- Hides from active view
- Still in database

**Delete Alert** (Admin Only):
- Click "Delete" on alert
- Permanently removes

### Anomaly Detection

**How It Works**:
- AI analyzes your usage patterns
- Detects unusual spikes (> 2x normal)
- Creates automatic alerts
- Helps catch:
  - API key leaks
  - Infinite loops
  - DDoS attacks
  - Billing errors

**Example**:
- Normal daily cost: $10
- Sudden spike: $30 in one hour
- Alert: "Anomaly detected: 300% increase"

---

## 💡 Optimization Tips

Get AI-powered recommendations to reduce costs.

### Viewing Recommendations

**Navigation**: Click "Optimization" in sidebar

**Recommendation Types**:

**1. Model Switching**
- Suggestion: Use cheaper model for simple tasks
- Example: "Use GPT-3.5 instead of GPT-4 for simple classification"
- Potential savings: $XXX per month

**2. Caching Opportunities**
- Suggestion: Cache repeated API calls
- Example: "Same query called 50 times - use caching"
- Potential savings: $XXX per month

**3. Batch Processing**
- Suggestion: Combine multiple requests
- Example: "Process embeddings in batches of 100"
- Potential savings: $XXX per month

**4. Provider Comparison**
- Shows cost differences between providers
- Example: "Anthropic Claude is 40% cheaper than GPT-4"
- Suggests switching providers

**5. Feature Optimization**
- Identifies expensive features
- Suggests alternatives
- Example: "Use text-davinci-003 instead of GPT-4 for summaries"

### Implementing Recommendations

1. **Review** each recommendation
2. **Evaluate** potential savings
3. **Test** suggested changes in development
4. **Implement** in production
5. **Monitor** cost reduction in dashboard

### Automatic Insights

System automatically generates recommendations based on:
- Your usage patterns
- Cost analysis
- Industry best practices
- Provider pricing changes

---

## 👤 Profile Management

View and edit your account information.

### Viewing Profile

**Navigation**: Click "Profile" in sidebar

**Information Displayed**:
- **Name**: Your full name
- **Email**: Login email
- **Company**: Company name
- **Role**: Admin, Developer, or User
- **Member Since**: Account creation date
- **Status**: Active

### Editing Profile

1. **Click** "Edit Profile" button

2. **Modify Fields**:
   - **Name**: Update full name
   - **Email**: Change email address
   - **Company**: Update company name
   - **Role**: Read-only (admin changes required)

3. **Click** "Save Changes"

4. **Result**: Profile updated instantly

### Account Information

**Security**:
- Password encrypted
- Secure session management
- Logout from any page

**Company Sharing**:
- All users with same company name see same data
- Shared cost analytics
- Collaborative budget management

---

## 👥 Multi-User Access

Multiple people can use the platform for your company.

### Adding Team Members

**Method 1: Self-Registration**
1. Team member goes to signup page
2. Registers with same **Company Name**
3. Automatically linked to your company data
4. Can view all company API logs and costs

**Method 2: Admin Invitation**
1. Admin shares application URL
2. Provides company name to use
3. New user signs up with exact company name
4. Access granted automatically

### User Roles

**Admin Role**:
- ✅ View all analytics
- ✅ Manage pricing rules
- ✅ Create/edit budgets
- ✅ Configure alerts
- ✅ View optimization tips
- ✅ Manage team

**Developer/User Role**:
- ✅ View dashboard
- ✅ View API logs
- ✅ Use live monitoring
- ✅ View budgets (read-only)
- ✅ View alerts
- ❌ Cannot edit pricing rules
- ❌ Cannot create budgets

### Changing Roles

**Via MongoDB Compass**:
1. Connect to database
2. Find `users` collection
3. Find user by email
4. Change `role` field to "admin" or "developer"
5. User must re-login

### Shared Data

All users with same **Company Name** share:
- API logs
- Cost analytics
- Budgets
- Alerts
- Pricing rules
- Optimization recommendations

Each user maintains separate:
- Login credentials
- Profile information
- Personal settings

### Access from Multiple Devices

**Same User, Different Devices**:
- Login from any computer
- Session syncs automatically
- Logout from one doesn't affect others

**Local Network Access**:
- Access via http://localhost:3000 (same computer)
- Or http://YOUR-IP:3000 (network devices)

**Internet Access** (Production):
- Deploy to Vercel/Netlify (frontend)
- Deploy to Render/Railway (backend)
- Access from anywhere via public URL

---

## 🔧 Troubleshooting

### Common Issues

**Problem: Can't Login**
- ✓ Check email/password spelling
- ✓ Ensure backend server running (port 5000)
- ✓ Check MongoDB connection
- ✓ Try demo credentials

**Problem: Dashboard Shows $0**
- ✓ Check if pricing rules exist
- ✓ Verify API logs have been created
- ✓ Try clicking "Refresh" button
- ✓ Check date filter range

**Problem: Live Monitor Not Working**
- ✓ Ensure "Start Live Monitor" clicked
- ✓ Check browser console for errors
- ✓ Verify backend is responding
- ✓ Try stopping and restarting
- ✓ Refresh page

**Problem: No Cost Calculated**
- ✓ Ensure pricing rule exists for provider/feature
- ✓ Check tokens are logged (not 0)
- ✓ Go to Pricing Rules page and add rule
- ✓ Re-log API call after adding rule

**Problem: Can't Create Budget**
- ✓ Check if you're admin role
- ✓ Verify amount is positive number
- ✓ Ensure all fields filled
- ✓ Check MongoDB connection

**Problem: Filters Not Working**
- ✓ Select option from dropdown
- ✓ Click to apply
- ✓ Reset by selecting "All"
- ✓ Refresh page if stuck

**Problem: Clear All Not Working**
- ✓ Check admin permissions
- ✓ Confirm deletion prompt
- ✓ Wait for completion
- ✓ Refresh page

### Getting Help

**Check These First**:
1. Backend running? (port 5000)
2. Frontend running? (port 3000)
3. MongoDB connected?
4. Browser console errors?
5. Network tab in DevTools

**Still Having Issues?**
- Review README.md
- Check environment variables
- Verify database credentials
- Test with demo accounts
- Try clearing browser cache

---

## 📈 Best Practices

### For Effective Cost Tracking

1. **Set Up Pricing Rules First**
   - Add all providers you use
   - Use accurate pricing from provider docs
   - Update when prices change

2. **Use Live Monitoring During Testing**
   - Watch API calls in real-time
   - Verify tracking is working
   - Debug integration issues

3. **Set Realistic Budgets**
   - Base on historical data
   - Add 20% buffer
   - Monitor monthly trends
   - Adjust as needed

4. **Configure Alerts Early**
   - Set at 80% of budget
   - Enable email notifications
   - Check alerts weekly
   - Act on anomalies quickly

5. **Review Optimization Tips**
   - Check monthly
   - Implement suggestions
   - Test before production
   - Measure savings

6. **Regular Maintenance**
   - Clear old logs (if needed)
   - Update pricing rules
   - Review team access
   - Check budget progress

### For Team Collaboration

1. **Consistent Company Names**
   - Use exact same spelling
   - Include punctuation
   - Case-sensitive

2. **Role Assignment**
   - First user: Admin
   - Additional users: Start as Developer
   - Promote to Admin as needed

3. **Communication**
   - Share budget limits with team
   - Discuss optimization strategies
   - Review alerts together
   - Plan API usage

### For Production Use

1. **Start with Test Logger**
   - Verify tracking works
   - Test cost calculations
   - Confirm pricing rules correct

2. **Integrate Gradually**
   - Start with one API
   - Add tracking function
   - Monitor for issues
   - Roll out to others

3. **Monitor Continuously**
   - Check dashboard daily
   - Review logs weekly
   - Analyze trends monthly
   - Optimize quarterly

---

## ✅ Quick Reference

### Essential Pages

| Page | Purpose | Key Features |
|------|---------|--------------|
| Dashboard | Overview | Total cost, charts, trends |
| API Logs | History | All calls, live monitor, filters |
| Test Logger | Testing | Manual logging, random generator |
| Pricing Rules | Cost Setup | Provider/model pricing |
| Budgets | Spending Control | Limits, progress tracking |
| Alerts | Notifications | Threshold, anomaly detection |
| Optimization | Savings | AI recommendations |
| Profile | Account | Edit details, view info |

### Keyboard Shortcuts

| Action | Shortcut | Description |
|--------|----------|-------------|
| Refresh Dashboard | Ctrl+R | Reload data |
| Toggle Live Monitor | L | Start/stop monitoring |
| Clear Filters | Esc | Reset all filters |
| Logout | Ctrl+L | Sign out |

### Status Colors

| Color | Meaning | Action |
|-------|---------|--------|
| 🟢 Green | Success / Safe | Normal operation |
| 🟡 Yellow | Warning | Monitor closely |
| 🔴 Red | Error / Danger | Immediate attention |
| 🔵 Blue | Info | Informational |

---

## 🎉 You're Ready!

You now know how to:
- ✅ Register and login
- ✅ View real-time cost analytics
- ✅ Track API calls with live monitoring
- ✅ Log real API calls (manual and automatic)
- ✅ Manage pricing rules
- ✅ Set and track budgets
- ✅ Configure alerts
- ✅ Optimize costs
- ✅ Collaborate with team
- ✅ Troubleshoot issues

**Start tracking your API costs today!** 🚀
