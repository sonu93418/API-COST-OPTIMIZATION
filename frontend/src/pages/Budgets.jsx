import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, DollarSign } from 'lucide-react';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const { isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    providerName: '',
    monthlyLimit: '',
    alertThreshold: 80
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/budgets');
      setBudgets(response.data.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await api.put(`/budgets/${editingBudget._id}`, formData);
      } else {
        await api.post('/budgets', formData);
      }
      fetchBudgets();
      closeModal();
    } catch (error) {
      console.error('Error saving budget:', error);
      alert(error.response?.data?.message || 'Failed to save budget');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await api.delete(`/budgets/${id}`);
        fetchBudgets();
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const updateSpend = async () => {
    try {
      const response = await api.post('/budgets/update-spend');
      alert(response.data.message);
      fetchBudgets();
    } catch (error) {
      console.error('Error updating spend:', error);
    }
  };

  const openModal = (budget = null) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        providerName: budget.providerName,
        monthlyLimit: budget.monthlyLimit,
        alertThreshold: budget.alertThreshold
      });
    } else {
      setEditingBudget(null);
      setFormData({
        providerName: '',
        monthlyLimit: '',
        alertThreshold: 80
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBudget(null);
  };

  const getUsagePercentage = (budget) => {
    return (budget.currentSpend / budget.monthlyLimit) * 100;
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 100) return 'bg-red-600';
    if (percentage >= 80) return 'bg-orange-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600 mt-1">Manage monthly spending limits</p>
        </div>
        {isAdmin && (
          <div className="flex gap-3">
            <button onClick={updateSpend} className="btn-secondary">
              Update Spend
            </button>
            <button onClick={() => openModal()} className="btn-primary flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add Budget
            </button>
          </div>
        )}
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const usagePercentage = getUsagePercentage(budget);
          const isOverBudget = usagePercentage >= 100;
          const isNearLimit = usagePercentage >= budget.alertThreshold;

          return (
            <div key={budget._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{budget.providerName}</h3>
                  <p className="text-sm text-gray-600">Period: {budget.period}</p>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(budget)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(budget._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-600">Current Spend</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${budget.currentSpend.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Monthly Limit</p>
                    <p className="text-xl font-semibold text-gray-700">
                      ${budget.monthlyLimit.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Usage</span>
                    <span className={`font-semibold ${
                      isOverBudget ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {usagePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${getProgressBarColor(usagePercentage)}`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Alert Threshold */}
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-gray-600">Alert Threshold</span>
                  <span className="font-medium">{budget.alertThreshold}%</span>
                </div>

                {/* Warning Message */}
                {isOverBudget && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                    ⚠️ Budget exceeded by ${(budget.currentSpend - budget.monthlyLimit).toFixed(2)}
                  </div>
                )}
                {!isOverBudget && isNearLimit && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700">
                    ⚠️ Approaching budget limit
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">
              {editingBudget ? 'Edit Budget' : 'Add Budget'}
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
                  placeholder="e.g., Twilio, OpenAI"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Limit ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.monthlyLimit}
                  onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
                  className="input-field"
                  placeholder="1000.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Threshold (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={formData.alertThreshold}
                  onChange={(e) => setFormData({ ...formData, alertThreshold: e.target.value })}
                  className="input-field"
                  placeholder="80"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Alert when spending reaches this percentage
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingBudget ? 'Update' : 'Create'}
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

export default Budgets;
