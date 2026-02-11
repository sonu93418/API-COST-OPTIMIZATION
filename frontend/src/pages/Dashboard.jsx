import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  getDashboardAnalytics, 
  getProviders, 
  getFeatures, 
  getOptimizationSuggestions, 
  getBudgets,
  getAPILogs,
  updateBudgetSpend
} from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';
import { 
  DollarSign, 
  Activity, 
  AlertCircle, 
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Settings,
  Filter,
  Search,
  Calendar,
  Target,
  FileText,
  Plus,
  Users,
  Lock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [filters, setFilters] = useState({
    provider: '',
    feature: '',
    status: '',
    customStartDate: '',
    customEndDate: ''
  });
  const [optimizationData, setOptimizationData] = useState(null);
  const [optimizationDays, setOptimizationDays] = useState('7');
  const [budgetData, setBudgetData] = useState(null);
  const [showInputSection, setShowInputSection] = useState(!isAuthenticated); // Show by default for public users
  const [providers, setProviders] = useState([]);
  const [features, setFeatures] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isPublicDemo, setIsPublicDemo] = useState(!isAuthenticated);

  useEffect(() => {
    setIsPublicDemo(!isAuthenticated);
    setShowInputSection(!isAuthenticated); // Auto-show controls for public users
    fetchDashboardData();
    fetchProviders();
    fetchFeatures();
    if (isAuthenticated) {
      fetchBudgets();
    }
  }, [dateRange, isAuthenticated]);

  useEffect(() => {
    if (filters.provider || filters.feature || filters.status || filters.customStartDate) {
      fetchDashboardData();
    }
  }, [filters]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getDemoData = (filterParams) => {
    // Generate demo data based on filters to show interactive results
    const baseData = {
      totalMetrics: {
        totalCost: 1247.56,
        totalRequests: 15420,
        successCount: 14681,
        failureCount: 739,
        avgResponseTime: 1230
      },
      costByProvider: [
        { _id: 'OpenAI', totalCost: 687.23, totalRequests: 8500, successCount: 8100 },
        { _id: 'Claude', totalCost: 312.45, totalRequests: 3200, successCount: 3080 },
        { _id: 'Google', totalCost: 147.88, totalRequests: 2100, successCount: 2001 },
        { _id: 'Cohere', totalCost: 100.00, totalRequests: 1620, successCount: 1500 }
      ],
      dailyTrends: [
        { date: '2024-02-04', cost: 45.23, requests: 520 },
        { date: '2024-02-05', cost: 52.67, requests: 610 },
        { date: '2024-02-06', cost: 38.91, requests: 445 },
        { date: '2024-02-07', cost: 61.34, requests: 720 },
        { date: '2024-02-08', cost: 49.82, requests: 575 },
        { date: '2024-02-09', cost: 67.45, requests: 780 },
        { date: '2024-02-10', cost: 43.21, requests: 495 }
      ]
    };

    // Apply filter effects to demo data
    if (filterParams.provider) {
      const provider = baseData.costByProvider.find(p => p._id === filterParams.provider);
      if (provider) {
        baseData.totalMetrics.totalCost = provider.totalCost;
        baseData.totalMetrics.totalRequests = provider.totalRequests;
        baseData.totalMetrics.successCount = provider.successCount;
        baseData.costByProvider = [provider];
      }
    }

    if (filterParams.customStartDate && filterParams.customEndDate) {
      // Simulate date filtering effect
      baseData.totalMetrics.totalCost *= 0.7; // Simulate smaller date range
      baseData.dailyTrends = baseData.dailyTrends.slice(-3); // Show fewer days
    }

    baseData.topExpensive = baseData.costByProvider.slice(0, 5);
    return baseData;
  };

  const getDemoProviders = () => [
    { _id: 'OpenAI', count: 8500 },
    { _id: 'Claude', count: 3200 },
    { _id: 'Google', count: 2100 },
    { _id: 'Cohere', count: 1620 }
  ];

  const getDemoFeatures = () => [
    { _id: 'GPT-4', count: 4200 },
    { _id: 'GPT-3.5', count: 4300 },
    { _id: 'Claude-3', count: 3200 },
    { _id: 'Gemini-Pro', count: 2100 },
    { _id: 'Command', count: 1620 }
  ];

  const getDemoOptimizations = (days) => [
    {
      priority: 'high',
      type: 'model-switch',
      title: 'Switch to GPT-3.5 for Simple Tasks',
      description: 'Using GPT-4 for basic tasks costs 10x more. Switch simple queries to GPT-3.5.',
      potentialSavings: 234.50,
      impact: 85
    },
    {
      priority: 'medium',
      type: 'caching', 
      title: 'Implement Response Caching',
      description: '23% of requests are duplicates. Cache responses for 1 hour to reduce costs.',
      potentialSavings: 156.78,
      impact: 65
    },
    {
      priority: 'low',
      type: 'batching',
      title: 'Batch Small Requests',
      description: 'Combine multiple small requests into single calls to reduce overhead.',
      potentialSavings: 67.23,
      impact: 25
    }
  ];

  const getDemoBudgets = () => [
    {
      _id: 'demo1',
      name: 'OpenAI Monthly Budget',
      limit: 1000,
      currentSpend: 687.23,
      period: 'monthly'
    },
    {
      _id: 'demo2', 
      name: 'Claude Budget',
      limit: 500,
      currentSpend: 312.45,
      period: 'monthly'
    }
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (!isAuthenticated) {
        // Use demo data for public users
        setTimeout(() => {
          const filterParams = { dateRange, ...filters };
          const demoData = getDemoData(filterParams);
          setData(demoData);
          setLoading(false);
        }, 800); // Simulate loading time
        return;
      }
      
      const filterParams = {
        dateRange,
        ...filters
      };
      
      const response = await getDashboardAnalytics(filterParams);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to demo data on error
      const demoData = getDemoData({ dateRange, ...filters });
      setData(demoData);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      if (!isAuthenticated) {
        setProviders(getDemoProviders());
        return;
      }
      
      const response = await getProviders();
      setProviders(response.data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setProviders(getDemoProviders());
    }
  };

  const fetchFeatures = async () => {
    try {
      if (!isAuthenticated) {
        setFeatures(getDemoFeatures());
        return;
      }
      
      const response = await getFeatures();
      setFeatures(response.data || []);
    } catch (error) {
      console.error('Error fetching features:', error);
      setFeatures(getDemoFeatures());
    }
  };

  const fetchBudgets = async () => {
    try {
      if (!isAuthenticated) {
        setBudgetData(getDemoBudgets());
        return;
      }
      
      const response = await getBudgets();
      setBudgetData(response.data || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchOptimizationSuggestions = async () => {
    try {
      if (!isAuthenticated) {
        setOptimizationData(getDemoOptimizations(optimizationDays));
        setMessage({
          type: 'success',
          text: '✅ Demo optimization analysis complete! Sign up to get real suggestions for your APIs.'
        });
        return;
      }
      
      const response = await getOptimizationSuggestions(optimizationDays);
      setOptimizationData(response.data || []);
    } catch (error) {
      console.error('Error fetching optimization suggestions:', error);
    }
  };

  const handleUpdateBudgetSpend = async () => {
    try {
      await updateBudgetSpend();
      await fetchBudgets(); // Refresh budget data
      setMessage({
        type: 'success',
        text: '✅ Budget spending updated successfully!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ Error updating budget: ${error.message}`
      });
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      provider: '',
      feature: '',
      status: '',
      customStartDate: '',
      customEndDate: ''
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center animate-fadeIn">
          <div>
            <div className="skeleton h-8 w-48 mb-2"></div>
            <div className="skeleton h-4 w-64"></div>
          </div>
          <div className="skeleton h-10 w-32"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-fadeIn" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="skeleton h-4 w-24 mb-2"></div>
                  <div className="skeleton h-8 w-32"></div>
                </div>
                <div className="skeleton h-12 w-12 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="card animate-fadeIn" style={{ animationDelay: `${i * 0.2}s` }}>
              <div className="skeleton h-6 w-32 mb-4"></div>
              <div className="skeleton h-64 w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { totalMetrics, costByProvider, dailyTrends, topExpensive } = data || {};
  const successRate = totalMetrics?.totalRequests 
    ? ((totalMetrics.successCount / totalMetrics.totalRequests) * 100).toFixed(1)
    : 0;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center animate-fadeIn">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isPublicDemo ? 'Interactive Demo Dashboard' : 'Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isPublicDemo 
              ? 'Explore with demo data - Create account to track your real API costs' 
              : 'Overview of your API usage and costs'
            }
          </p>
          {isPublicDemo && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">Ready to Track Real API Costs?</h3>
                  <p className="text-blue-700 text-sm mb-3">
                    This demo shows realistic data. Create an account to track your actual API usage, set budgets, get alerts, and optimize costs.
                  </p>
                  <div className="flex gap-2">
                    <a
                      href="/signup"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Create Free Account
                    </a>
                    <a
                      href="/login"
                      className="px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                    >
                      Sign In
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
          {message.text && (
            <div className={`mt-2 p-3 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isPublicDemo ? (
            <>
              <a 
                href="/login" 
                className="btn-secondary flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Login
              </a>
              <a 
                href="/signup" 
                className="btn-primary flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Sign Up Free
              </a>
            </>
          ) : (
            <>
              <a 
                href="/test-logger" 
                className="btn-secondary flex items-center gap-2"
                title="Test API Logger"
              >
                <Plus className="w-4 h-4" />
                Log Test API
              </a>
            </>
          )}
          <button
            onClick={() => setShowInputSection(!showInputSection)}
            className={`btn-secondary flex items-center gap-2 ${showInputSection ? 'bg-primary-50 text-primary-700 border-primary-200' : ''}`}
          >
            <Settings className="w-4 h-4" />
            {showInputSection ? 'Hide Controls' : 'Show Controls'}
          </button>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field w-auto"
            disabled={filters.customStartDate && filters.customEndDate}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button
            onClick={fetchDashboardData}
            className="btn-secondary flex items-center gap-2"
            title="Refresh data"
          >
            <Activity className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Dashboard Input Controls */}
      {showInputSection && (
        <div className="card space-y-6 animate-fadeIn">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
            <Filter className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Dashboard Controls</h2>
          </div>
          
          {/* Analytics Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Custom Start Date
              </label>
              <input
                type="date"
                value={filters.customStartDate}
                onChange={(e) => handleFilterChange('customStartDate', e.target.value)}
                className="input-field w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Custom End Date
              </label>
              <input
                type="date"
                value={filters.customEndDate}
                onChange={(e) => handleFilterChange('customEndDate', e.target.value)}
                className="input-field w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Filter by Provider
              </label>
              <select
                value={filters.provider}
                onChange={(e) => handleFilterChange('provider', e.target.value)}
                className="input-field w-full"
              >
                <option value="">All Providers</option>
                {providers.map((provider) => (
                  <option key={provider._id} value={provider._id}>
                    {provider._id} ({provider.count} calls)
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Filter by Feature
              </label>
              <select
                value={filters.feature}
                onChange={(e) => handleFilterChange('feature', e.target.value)}
                className="input-field w-full"
              >
                <option value="">All Features</option>
                {features.map((feature) => (
                  <option key={feature._id} value={feature._id}>
                    {feature._id} ({feature.count} calls)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optimization Controls */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Optimization Analysis
            </h3>
            <div className="flex items-end gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Analysis Period (Days)
                </label>
                <select
                  value={optimizationDays}
                  onChange={(e) => setOptimizationDays(e.target.value)}
                  className="input-field"
                >
                  <option value="7">Last 7 days</option>
                  <option value="14">Last 14 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="60">Last 60 days</option>
                </select>
              </div>
              <button
                onClick={fetchOptimizationSuggestions}
                className="btn-primary flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Get Suggestions
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="btn-secondary"
            >
              Clear All Filters
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleUpdateBudgetSpend}
                className="btn-secondary flex items-center gap-2"
                title="Update budget spending from current data"
              >
                <DollarSign className="w-4 h-4" />
                Update Budget Spend
              </button>
              <button
                onClick={fetchDashboardData}
                className="btn-primary flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Cost</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${totalMetrics?.totalCost?.toFixed(2) || '0.00'}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Track your spending
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalMetrics?.totalRequests?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">API calls made</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{successRate}%</p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                {successRate >= 95 ? (
                  <><CheckCircle className="w-3 h-3 text-green-600" /> Excellent</>
                ) : (
                  <><AlertCircle className="w-3 h-3 text-yellow-600" /> Needs attention</>
                )}
              </p>
            </div>
            <div className={`w-14 h-14 bg-gradient-to-br ${successRate >= 95 ? 'from-blue-400 to-blue-600' : 'from-yellow-400 to-yellow-600'} rounded-2xl flex items-center justify-center shadow-lg`}>
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Response Time</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalMetrics?.avgResponseTime?.toFixed(0) || '0'}ms
              </p>
              <p className="text-xs text-gray-500 mt-1">Performance metric</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Trend */}
        <div className="card animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cost Trend</h3>
            <span className="badge badge-info">
              <TrendingUp className="w-3 h-3" />
              Daily
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                stroke="#9ca3af"
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value) => [`$${value.toFixed(2)}`, 'Cost']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalCost" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Daily Cost"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cost by Provider */}
        <div className="card animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cost by Provider</h3>
            <span className="badge badge-info">Top 5</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costByProvider?.slice(0, 5)}
                dataKey="totalCost"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry._id}: $${entry.totalCost.toFixed(2)}`}
                labelLine={{ stroke: '#6b7280' }}
              >
                {costByProvider?.slice(0, 5).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} contentStyle={{ borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Expensive APIs */}
      <div className="card animate-fadeIn" style={{ animationDelay: '0.7s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top Expensive APIs</h3>
          <span className="badge badge-warning">
            <AlertCircle className="w-3 h-3" />
            Monitor closely
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Provider</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Total Cost</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Requests</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Success Rate</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Avg Cost/Request</th>
              </tr>
            </thead>
            <tbody>
              {topExpensive?.map((provider, index) => {
                const successRate = (provider.successCount / provider.totalRequests * 100).toFixed(1);
                const avgCost = (provider.totalCost / provider.totalRequests).toFixed(4);
                
                return (
                  <tr 
                    key={index} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    <td className="py-4 px-4 font-semibold text-gray-900">{provider._id}</td>
                    <td className="py-4 px-4 text-gray-900 font-medium">${provider.totalCost.toFixed(2)}</td>
                    <td className="py-4 px-4 text-gray-600">{provider.totalRequests.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      {successRate >= 95 ? (
                        <span className="badge badge-success">
                          <CheckCircle className="w-3 h-3" />
                          {successRate}%
                        </span>
                      ) : successRate >= 85 ? (
                        <span className="badge badge-warning">
                          <AlertCircle className="w-3 h-3" />
                          {successRate}%
                        </span>
                      ) : (
                        <span className="badge badge-error">
                          <XCircle className="w-3 h-3" />
                          {successRate}%
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-600">${avgCost}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimization Suggestions */}
      {optimizationData && optimizationData.length > 0 && (
        <div className="card animate-fadeIn" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Optimization Suggestions
            </h3>
            <span className="badge badge-info">
              {optimizationData.length} suggestions
            </span>
          </div>
          <div className="space-y-3">
            {optimizationData.slice(0, 10).map((suggestion, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  suggestion.priority === 'high' ? 'border-red-200 bg-red-50' :
                  suggestion.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-green-200 bg-green-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`badge ${
                        suggestion.priority === 'high' ? 'badge-error' :
                        suggestion.priority === 'medium' ? 'badge-warning' :
                        'badge-success'
                      }`}>
                        {suggestion.priority.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">{suggestion.type}</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600">{suggestion.description}</p>
                    {suggestion.potentialSavings && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        💰 Potential savings: ${suggestion.potentialSavings.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {suggestion.impact && (
                      <div className="text-sm font-medium text-gray-900">
                        {suggestion.impact}% impact
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Overview */}
      {budgetData && budgetData.length > 0 && (
        <div className="card animate-fadeIn" style={{ animationDelay: '0.9s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Budget Status
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetData.map((budget, index) => {
              const percentage = budget.limit > 0 ? (budget.currentSpend / budget.limit) * 100 : 0;
              const isOverBudget = percentage > 100;
              const isNearLimit = percentage > 80 && !isOverBudget;
              
              return (
                <div 
                  key={budget._id} 
                  className={`p-4 rounded-lg border ${
                    isOverBudget ? 'border-red-200 bg-red-50' :
                    isNearLimit ? 'border-yellow-200 bg-yellow-50' :
                    'border-green-200 bg-green-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{budget.name}</h4>
                    <span className={`badge ${
                      isOverBudget ? 'badge-error' :
                      isNearLimit ? 'badge-warning' :
                      'badge-success'
                    }`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Spent:</span>
                      <span className="font-medium">${budget.currentSpend?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Limit:</span>
                      <span className="font-medium">${budget.limit?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isOverBudget ? 'bg-red-500' :
                          isNearLimit ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    {budget.period && (
                      <div className="text-xs text-gray-500 mt-2">
                        Period: {budget.period}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
