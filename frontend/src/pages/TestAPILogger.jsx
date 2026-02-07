import React, { useState } from 'react';
import { logAPICall } from '../services/apiLogService';
import { Send, Zap, AlertCircle, CheckCircle } from 'lucide-react';

const TestAPILogger = () => {
  const [formData, setFormData] = useState({
    providerName: 'OpenAI',
    endpoint: '/v1/chat/completions',
    method: 'POST',
    featureName: 'GPT-4',
    inputTokens: 150,
    outputTokens: 100,
    responseTime: 1200,
    status: 'success'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await logAPICall({
        ...formData,
        inputTokens: parseInt(formData.inputTokens),
        outputTokens: parseInt(formData.outputTokens),
        responseTime: parseInt(formData.responseTime),
        requestCount: 1
      });

      setMessage({
        type: 'success',
        text: '✅ API call logged successfully! Check the API Logs page.'
      });

      // Reset form after success
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);

    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ Error: ${error.response?.data?.error || error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const simulateAPICall = () => {
    const providers = [
      { name: 'OpenAI', endpoint: '/v1/chat/completions', feature: 'GPT-4' },
      { name: 'OpenAI', endpoint: '/v1/embeddings', feature: 'text-embedding-ada-002' },
      { name: 'Anthropic', endpoint: '/v1/messages', feature: 'Claude-3.5-Sonnet' },
      { name: 'Google', endpoint: '/v1/models/gemini-pro:generateContent', feature: 'Gemini-Pro' },
      { name: 'Hugging Face', endpoint: '/models/bert-base-uncased', feature: 'BERT-Base-Uncased' }
    ];

    const random = providers[Math.floor(Math.random() * providers.length)];
    const randomTokens = Math.floor(Math.random() * 1000) + 100;
    const randomTime = Math.floor(Math.random() * 2000) + 500;

    setFormData({
      providerName: random.name,
      endpoint: random.endpoint,
      method: 'POST',
      featureName: random.feature,
      inputTokens: randomTokens,
      outputTokens: Math.floor(randomTokens * 0.7),
      responseTime: randomTime,
      status: Math.random() > 0.1 ? 'success' : 'failed'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Test API Logger</h1>
        </div>
        <p className="text-primary-100 text-lg">
          Log real API calls and see them appear instantly in your dashboard
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">How to Use</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Fill in the form below with your real API call details</li>
              <li>• Click "Log API Call" to submit</li>
              <li>• Go to "API Logs" page to see your logged data</li>
              <li>• Use "Generate Random" to test with sample data</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div
          className={`p-4 rounded-lg mb-6 animate-fadeIn ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            )}
            <p
              className={`text-sm ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {message.text}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Provider Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider Name *
            </label>
            <input
              type="text"
              name="providerName"
              value={formData.providerName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., OpenAI, Anthropic"
            />
          </div>

          {/* Feature Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feature/Model *
            </label>
            <input
              type="text"
              name="featureName"
              value={formData.featureName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., GPT-4, Claude-3.5"
            />
          </div>

          {/* Endpoint */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endpoint *
            </label>
            <input
              type="text"
              name="endpoint"
              value={formData.endpoint}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="/v1/chat/completions"
            />
          </div>

          {/* Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Method *
            </label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="POST">POST</option>
              <option value="GET">GET</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          {/* Input Tokens */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Tokens
            </label>
            <input
              type="number"
              name="inputTokens"
              value={formData.inputTokens}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="150"
            />
          </div>

          {/* Output Tokens */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Tokens
            </label>
            <input
              type="number"
              name="outputTokens"
              value={formData.outputTokens}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="100"
            />
          </div>

          {/* Response Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Time (ms)
            </label>
            <input
              type="number"
              name="responseTime"
              value={formData.responseTime}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="1200"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Log API Call
              </>
            )}
          </button>

          <button
            type="button"
            onClick={simulateAPICall}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Generate Random
          </button>
        </div>
      </form>

      {/* Integration Example */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Integration Example</h3>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`import { trackAPICall } from './services/apiLogService';

// Wrap your API calls with trackAPICall
const response = await trackAPICall(
  'OpenAI',                    // Provider
  '/v1/chat/completions',      // Endpoint
  'POST',                       // Method
  'GPT-4',                      // Feature/Model
  async () => {
    // Your actual API call
    return await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "Hello!" }]
    });
  }
);

// Response time, tokens, and costs are automatically logged!`}
        </pre>
      </div>
    </div>
  );
};

export default TestAPILogger;
