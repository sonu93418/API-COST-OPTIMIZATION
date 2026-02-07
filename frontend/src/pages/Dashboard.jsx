import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  DollarSign, 
  Activity, 
  AlertCircle, 
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));
      
      const response = await api.get('/analytics/dashboard', {
        params: {
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString()
        }
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your API usage and costs</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field w-auto"
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
    </div>
  );
};

export default Dashboard;
