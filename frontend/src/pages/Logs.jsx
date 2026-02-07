import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Filter, Download } from 'lucide-react';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    provider: '',
    feature: '',
    status: '',
    page: 1
  });
  const [providers, setProviders] = useState([]);
  const [features, setFeatures] = useState([]);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchProviders();
    fetchFeatures();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/analytics/logs', { params: filters });
      setLogs(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await api.get('/analytics/providers');
      setProviders(response.data.data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const fetchFeatures = async () => {
    try {
      const response = await api.get('/analytics/features');
      setFeatures(response.data.data);
    } catch (error) {
      console.error('Error fetching features:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const getStatusBadge = (status) => {
    const colors = {
      success: 'bg-green-100 text-green-700',
      failure: 'bg-red-100 text-red-700',
      error: 'bg-yellow-100 text-yellow-700'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Logs</h1>
          <p className="text-gray-600 mt-1">View and filter all API call logs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
            <select
              value={filters.provider}
              onChange={(e) => handleFilterChange('provider', e.target.value)}
              className="input-field"
            >
              <option value="">All Providers</option>
              {providers.map((provider) => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Feature</label>
            <select
              value={filters.feature}
              onChange={(e) => handleFilterChange('feature', e.target.value)}
              className="input-field"
            >
              <option value="">All Features</option>
              {features.map((feature) => (
                <option key={feature} value={feature}>{feature}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading logs...</div>
          ) : (
            <>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Time</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Provider</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Endpoint</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Feature</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Response Time</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-medium">{log.providerName}</td>
                      <td className="py-3 px-4 text-sm">{log.endpointName}</td>
                      <td className="py-3 px-4 text-sm">{log.featureName}</td>
                      <td className="py-3 px-4">{getStatusBadge(log.status)}</td>
                      <td className="py-3 px-4 text-sm">{log.responseTime}ms</td>
                      <td className="py-3 px-4 text-sm font-medium">
                        ${log.calculatedCost.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              <div className="flex justify-between items-center mt-4 px-4 py-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={filters.page === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={filters.page === pagination.pages}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logs;
