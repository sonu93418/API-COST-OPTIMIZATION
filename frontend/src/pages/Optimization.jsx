import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Lightbulb, 
  TrendingDown, 
  Zap, 
  Database, 
  Copy,
  Clock
} from 'lucide-react';

const Optimization = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchSuggestions();
  }, [days]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/optimization/suggestions', {
        params: { days }
      });
      setSuggestions(response.data.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      'caching': <Database className="w-5 h-5" />,
      'rate-limiting': <Clock className="w-5 h-5" />,
      'batching': <Copy className="w-5 h-5" />,
      'duplicate-removal': <Copy className="w-5 h-5" />,
      'performance': <Zap className="w-5 h-5" />
    };
    return icons[type] || <Lightbulb className="w-5 h-5" />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return colors[priority] || colors.medium;
  };

  const filteredSuggestions = selectedType === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.type === selectedType);

  const typeLabels = {
    'caching': 'Caching',
    'rate-limiting': 'Rate Limiting',
    'batching': 'Batching',
    'duplicate-removal': 'Duplicate Removal',
    'performance': 'Performance'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Optimization Insights</h1>
          <p className="text-gray-600 mt-1">
            AI-powered suggestions to reduce costs and improve performance
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="input-field w-auto"
        >
          <option value="7">Last 7 days</option>
          <option value="14">Last 14 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>

      {/* Filter Tabs */}
      <div className="card">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedType === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({suggestions.length})
          </button>
          {Object.entries(typeLabels).map(([type, label]) => {
            const count = suggestions.filter(s => s.type === type).length;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === type 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        {loading ? (
          <div className="card text-center py-8 text-gray-600">
            Loading optimization suggestions...
          </div>
        ) : filteredSuggestions.length === 0 ? (
          <div className="card text-center py-12">
            <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Suggestions Available
            </h3>
            <p className="text-gray-600">
              {selectedType === 'all' 
                ? 'Your API usage looks optimized! Check back later for new insights.'
                : `No ${typeLabels[selectedType]?.toLowerCase()} suggestions at this time.`}
            </p>
          </div>
        ) : (
          filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`card border-l-4 ${
                suggestion.priority === 'high' 
                  ? 'border-red-500' 
                  : suggestion.priority === 'medium' 
                  ? 'border-yellow-500' 
                  : 'border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${getPriorityColor(suggestion.priority)}`}>
                    {getTypeIcon(suggestion.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {suggestion.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
                        getPriorityColor(suggestion.priority)
                      }`}>
                        {suggestion.priority} Priority
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="font-medium">{suggestion.provider}</span>
                      {suggestion.feature && (
                        <>
                          <span>•</span>
                          <span>{suggestion.feature}</span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-700 mb-4">{suggestion.description}</p>

                    {/* Impact Metrics */}
                    {suggestion.impact && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          📊 Impact Analysis
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          {Object.entries(suggestion.impact).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-gray-600 block capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="font-semibold text-gray-900">
                                {typeof value === 'number' ? value.toLocaleString() : value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendation */}
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-primary-900 mb-2 flex items-center">
                        <TrendingDown className="w-4 h-4 mr-2" />
                        Recommendation
                      </h4>
                      <p className="text-sm text-primary-800">{suggestion.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Card */}
      {!loading && suggestions.length > 0 && (
        <div className="card bg-gradient-to-r from-primary-50 to-primary-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💡 Optimization Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Total Suggestions</p>
              <p className="text-2xl font-bold text-gray-900">{suggestions.length}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">High Priority</p>
              <p className="text-2xl font-bold text-red-600">
                {suggestions.filter(s => s.priority === 'high').length}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Potential Savings</p>
              <p className="text-2xl font-bold text-green-600">
                {suggestions.reduce((sum, s) => {
                  const savings = s.impact?.potentialSavings;
                  if (savings && typeof savings === 'string') {
                    return sum + parseFloat(savings.replace('$', ''));
                  }
                  return sum;
                }, 0).toFixed(2)}$
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Optimization;
