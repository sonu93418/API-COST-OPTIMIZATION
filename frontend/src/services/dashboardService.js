import api from './api';

/**
 * Dashboard Service - Handle all dashboard data interactions
 */

/**
 * Get dashboard analytics with filters
 * @param {Object} filters - Filter parameters
 * @returns {Promise}
 */
export const getDashboardAnalytics = async (filters = {}) => {
  try {
    const params = {};
    
    // Handle date range
    if (filters.customStartDate && filters.customEndDate) {
      params.startDate = filters.customStartDate;
      params.endDate = filters.customEndDate;
    } else if (filters.dateRange) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(filters.dateRange));
      params.startDate = startDate.toISOString();
      params.endDate = new Date().toISOString();
    }
    
    // Add other filters
    if (filters.provider) params.provider = filters.provider;
    if (filters.feature) params.feature = filters.feature;
    if (filters.status) params.status = filters.status;
    
    const response = await api.get('/analytics/dashboard', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    throw error;
  }
};

/**
 * Get available providers
 * @returns {Promise}
 */
export const getProviders = async () => {
  try {
    const response = await api.get('/analytics/providers');
    return response.data;
  } catch (error) {
    console.error('Error fetching providers:', error);
    throw error;
  }
};

/**
 * Get available features
 * @returns {Promise}
 */
export const getFeatures = async () => {
  try {
    const response = await api.get('/analytics/features');
    return response.data;
  } catch (error) {
    console.error('Error fetching features:', error);
    throw error;
  }
};

/**
 * Get optimization suggestions
 * @param {number} days - Number of days to analyze
 * @param {string} type - Optional type filter
 * @returns {Promise}
 */
export const getOptimizationSuggestions = async (days = 7, type = null) => {
  try {
    const endpoint = type ? `/optimization/suggestions/${type}` : '/optimization/suggestions';
    const response = await api.get(endpoint, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching optimization suggestions:', error);
    throw error;
  }
};

/**
 * Get all budgets
 * @returns {Promise}
 */
export const getBudgets = async () => {
  try {
    const response = await api.get('/budgets');
    return response.data;
  } catch (error) {
    console.error('Error fetching budgets:', error);
    throw error;
  }
};

/**
 * Get filtered API logs
 * @param {Object} filters - Log filter parameters
 * @returns {Promise}
 */
export const getAPILogs = async (filters = {}) => {
  try {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 50
    };
    
    if (filters.provider) params.provider = filters.provider;
    if (filters.feature) params.feature = filters.feature;
    if (filters.status) params.status = filters.status;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    
    const response = await api.get('/analytics/logs', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching API logs:', error);
    throw error;
  }
};

/**
 * Get cost trends
 * @param {Object} filters - Filter parameters
 * @returns {Promise}
 */
export const getCostTrends = async (filters = {}) => {
  try {
    const params = {};
    
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.provider) params.provider = filters.provider;
    if (filters.granularity) params.granularity = filters.granularity;
    
    const response = await api.get('/analytics/cost-trends', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching cost trends:', error);
    throw error;
  }
};

/**
 * Create or update budget
 * @param {Object} budgetData - Budget data
 * @returns {Promise}
 */
export const saveBudget = async (budgetData) => {
  try {
    const response = budgetData.id 
      ? await api.put(`/budgets/${budgetData.id}`, budgetData)
      : await api.post('/budgets', budgetData);
    return response.data;
  } catch (error) {
    console.error('Error saving budget:', error);
    throw error;
  }
};

/**
 * Update current spend for budget
 * @returns {Promise}
 */
export const updateBudgetSpend = async () => {
  try {
    const response = await api.post('/budgets/update-spend');
    return response.data;
  } catch (error) {
    console.error('Error updating budget spend:', error);
    throw error;
  }
};

/**
 * Export dashboard data
 * @param {Object} filters - Export filter parameters
 * @returns {Promise}
 */
export const exportDashboardData = async (filters = {}) => {
  try {
    const response = await api.get('/analytics/export', {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting dashboard data:', error);
    throw error;
  }
};