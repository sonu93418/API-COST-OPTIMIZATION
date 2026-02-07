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
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your API usage and costs</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="input-field w-auto"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${totalMetrics?.totalCost?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalMetrics?.totalRequests?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{successRate}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalMetrics?.avgResponseTime?.toFixed(0) || '0'}ms
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value) => [`$${value.toFixed(2)}`, 'Cost']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalCost" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Daily Cost"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cost by Provider */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost by Provider</h3>
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
              >
                {costByProvider?.slice(0, 5).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Expensive APIs */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Expensive APIs</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Provider</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Total Cost</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Requests</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Success Rate</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Avg Cost/Request</th>
              </tr>
            </thead>
            <tbody>
              {topExpensive?.map((provider, index) => {
                const successRate = (provider.successCount / provider.totalRequests * 100).toFixed(1);
                const avgCost = (provider.totalCost / provider.totalRequests).toFixed(4);
                
                return (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{provider._id}</td>
                    <td className="py-3 px-4">${provider.totalCost.toFixed(2)}</td>
                    <td className="py-3 px-4">{provider.totalRequests.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        successRate >= 95 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {successRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4">${avgCost}</td>
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
