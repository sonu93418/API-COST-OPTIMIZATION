import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Bell, CheckCircle, XCircle, AlertTriangle, Play } from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter === 'unread') params.isRead = false;
      if (filter === 'unresolved') params.isResolved = false;
      
      const response = await api.get('/alerts', { params });
      setAlerts(response.data.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/alerts/${id}/read`);
      fetchAlerts();
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const resolveAlert = async (id) => {
    try {
      await api.put(`/alerts/${id}/resolve`);
      fetchAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const runDetection = async () => {
    try {
      const response = await api.post('/alerts/detect');
      alert(response.data.message);
      fetchAlerts();
    } catch (error) {
      console.error('Error running detection:', error);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-blue-100 text-blue-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700'
    };
    return colors[severity] || colors.medium;
  };

  const getTypeIcon = (type) => {
    const icons = {
      spike: '📈',
      budget: '💰',
      error: '⚠️',
      anomaly: '🔍'
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-600 mt-1">Monitor anomalies and important events</p>
        </div>
        {isAdmin && (
          <button onClick={runDetection} className="btn-primary flex items-center">
            <Play className="w-5 h-5 mr-2" />
            Run Detection
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Alerts
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unread' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('unresolved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unresolved' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unresolved
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="card text-center py-8 text-gray-600">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="card text-center py-8 text-gray-600">No alerts found</div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert._id}
              className={`card ${!alert.isRead ? 'border-l-4 border-primary-600' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(alert.type)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <p className="text-sm text-gray-600">{alert.providerName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{alert.message}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{new Date(alert.createdAt).toLocaleString()}</span>
                    {alert.isResolved && (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {!alert.isRead && (
                    <button
                      onClick={() => markAsRead(alert._id)}
                      className="btn-secondary text-sm"
                      title="Mark as read"
                    >
                      Mark Read
                    </button>
                  )}
                  {!alert.isResolved && (
                    <button
                      onClick={() => resolveAlert(alert._id)}
                      className="btn-primary text-sm"
                      title="Resolve alert"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;
