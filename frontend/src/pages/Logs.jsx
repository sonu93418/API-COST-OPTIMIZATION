import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Filter, Download, RefreshCw, Play, Pause, Activity, Clock, Trash2, AlertTriangle } from 'lucide-react';
import { clearAllLogs } from '../services/apiLogService';

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
  
  // Live monitoring states
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [newLogsCount, setNewLogsCount] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchProviders();
    fetchFeatures();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  // Live monitoring effect
  useEffect(() => {
    if (isLiveMode) {
      // Refresh every 5 seconds when live mode is on
      intervalRef.current = setInterval(() => {
        fetchLogsLive();
      }, 5000);
    } else {
      // Clear interval when live mode is off
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLiveMode, filters]);

  const fetchLogs = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await api.get('/analytics/logs', { params: filters });
      setLogs(response.data.data);
      setPagination(response.data.pagination);
      setLastUpdate(new Date());
      setNewLogsCount(0);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchLogsLive = async () => {
    try {
      const response = await api.get('/analytics/logs', { params: filters });
      const newData = response.data.data;
      
      // Check if there are new logs
      if (newData.length > 0 && logs.length > 0 && newData[0]._id !== logs[0]._id) {
        const newCount = newData.findIndex(log => log._id === logs[0]._id);
        setNewLogsCount(newCount > 0 ? newCount : 0);
      }
      
      setLogs(newData);
      setPagination(response.data.pagination);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const toggleLiveMode = () => {
    setIsLiveMode(!isLiveMode);
    if (!isLiveMode) {
      setNewLogsCount(0);
      fetchLogs(true);
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

  const handleClearLogs = async () => {
    if (window.confirm('⚠️ Are you sure you want to delete ALL logs? This cannot be undone!')) {
      try {
        setLoading(true);
        await clearAllLogs();
        await fetchLogs();
        alert('✅ All logs cleared successfully!');
      } catch (error) {
        alert('❌ Failed to clear logs: ' + (error.response?.data?.error || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center animate-fadeIn">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Logs</h1>
          <p className="text-gray-600 mt-1">View and filter all API call logs</p>
        </div>
        
        {/* Live Monitoring Controls */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Updated: {lastUpdate.toLocaleTimeString()}
          </div>

          <button
            onClick={handleClearLogs}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
            title="Clear all logs"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
          
          <button
            onClick={toggleLiveMode}
            className={`btn-primary flex items-center gap-2 ${isLiveMode ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            {isLiveMode ? (
              <>
                <Pause className="w-4 h-4" />
                Live Mode ON
                {newLogsCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-white text-green-600 rounded-full text-xs font-bold">
                    +{newLogsCount}
                  </span>
                )}
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Live Monitor
              </>
            )}
          </button>

          <button
            onClick={() => fetchLogs()}
            className="btn-secondary flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Live Status Banner */}
      {isLiveMode && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-fadeIn flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-green-600 animate-pulse" />
            <div>
              <p className="text-sm font-semibold text-green-900">
                Live Monitoring Active
              </p>
              <p className="text-xs text-green-700">
                Auto-refreshing every 5 seconds • New API calls will appear automatically
              </p>
            </div>
          </div>
          {newLogsCount > 0 && (
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">
              {newLogsCount} new call{newLogsCount > 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

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
      <div className="card animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">API Call History</h3>
          <div className="text-sm text-gray-600">
            Total Logs: <span className="font-semibold text-gray-900">{pagination.total || 0}</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-600">Loading logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No API calls found</p>
              <p className="text-sm text-gray-500 mt-1">Make some API calls to see them here</p>
            </div>
          ) : (
            <>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Time</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Provider</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Endpoint</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Feature</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Status</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Response Time</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr 
                      key={log._id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${
                        index < newLogsCount ? 'bg-green-50 animate-fadeIn' : ''
                      }`}
                    >
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {new Date(log.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-900">{log.providerName}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{log.endpointName}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{log.featureName}</td>
                      <td className="py-4 px-4">{getStatusBadge(log.status)}</td>
                      <td className="py-4 px-4 text-sm text-gray-900 font-medium">{log.responseTime}ms</td>
                      <td className="py-4 px-4 text-sm font-semibold text-gray-900">
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
