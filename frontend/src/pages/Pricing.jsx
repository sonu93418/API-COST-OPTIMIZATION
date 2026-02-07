import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Pricing = () => {
  const [pricingRules, setPricingRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const { isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    providerName: '',
    costPerRequest: '',
    freeTierLimit: 0,
    description: ''
  });

  useEffect(() => {
    fetchPricingRules();
  }, []);

  const fetchPricingRules = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pricing');
      setPricingRules(response.data.data);
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRule) {
        await api.put(`/pricing/${editingRule._id}`, formData);
      } else {
        await api.post('/pricing', formData);
      }
      fetchPricingRules();
      closeModal();
    } catch (error) {
      console.error('Error saving pricing rule:', error);
      alert(error.response?.data?.message || 'Failed to save pricing rule');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pricing rule?')) {
      try {
        await api.delete(`/pricing/${id}`);
        fetchPricingRules();
      } catch (error) {
        console.error('Error deleting pricing rule:', error);
      }
    }
  };

  const openModal = (rule = null) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        providerName: rule.providerName,
        costPerRequest: rule.costPerRequest,
        freeTierLimit: rule.freeTierLimit,
        description: rule.description || ''
      });
    } else {
      setEditingRule(null);
      setFormData({
        providerName: '',
        costPerRequest: '',
        freeTierLimit: 0,
        description: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRule(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pricing Rules</h1>
          <p className="text-gray-600 mt-1">Manage API pricing configurations</p>
        </div>
        {isAdmin && (
          <button onClick={() => openModal()} className="btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Pricing Rule
          </button>
        )}
      </div>

      {/* Pricing Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pricingRules.map((rule) => (
          <div key={rule._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{rule.providerName}</h3>
                {rule.description && (
                  <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                )}
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(rule)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(rule._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Cost per Request:</span>
                <span className="font-semibold">${rule.costPerRequest}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Free Tier:</span>
                <span className="font-semibold">{rule.freeTierLimit.toLocaleString()} requests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  rule.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {rule.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">
              {editingRule ? 'Edit Pricing Rule' : 'Add Pricing Rule'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.providerName}
                  onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Twilio, OpenAI, Google Maps"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost per Request ($)
                </label>
                <input
                  type="number"
                  step="0.000001"
                  required
                  value={formData.costPerRequest}
                  onChange={(e) => setFormData({ ...formData, costPerRequest: e.target.value })}
                  className="input-field"
                  placeholder="0.001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Free Tier Limit
                </label>
                <input
                  type="number"
                  required
                  value={formData.freeTierLimit}
                  onChange={(e) => setFormData({ ...formData, freeTierLimit: e.target.value })}
                  className="input-field"
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Brief description of the API"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingRule ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
