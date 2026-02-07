import api from './api';

/**
 * API Logging Service - Track real API calls
 */

/**
 * Log a single API call
 * @param {Object} logData - API call details
 * @returns {Promise}
 */
export const logAPICall = async (logData) => {
  try {
    const response = await api.post('/logs', logData);
    return response.data;
  } catch (error) {
    console.error('Error logging API call:', error);
    throw error;
  }
};

/**
 * Log multiple API calls at once
 * @param {Array} logs - Array of API call data
 * @returns {Promise}
 */
export const bulkLogAPICalls = async (logs) => {
  try {
    const response = await api.post('/logs/bulk', { logs });
    return response.data;
  } catch (error) {
    console.error('Error bulk logging API calls:', error);
    throw error;
  }
};

/**
 * Delete a specific API log
 * @param {string} logId - Log ID to delete
 * @returns {Promise}
 */
export const deleteAPILog = async (logId) => {
  try {
    const response = await api.delete(`/logs/${logId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting API log:', error);
    throw error;
  }
};

/**
 * Clear all API logs for current user
 * @returns {Promise}
 */
export const clearAllLogs = async () => {
  try {
    const response = await api.delete('/logs/clear');
    return response.data;
  } catch (error) {
    console.error('Error clearing logs:', error);
    throw error;
  }
};

/**
 * Helper to automatically log API calls with error handling
 * Wrap your API calls with this function
 * 
 * @example
 * const result = await trackAPICall(
 *   'OpenAI', 
 *   'chat.completions.create',
 *   'POST',
 *   'GPT-4',
 *   async () => {
 *     return await openai.chat.completions.create({...});
 *   }
 * );
 */
export const trackAPICall = async (
  providerName,
  endpoint,
  method,
  featureName,
  apiCallFunction
) => {
  const startTime = Date.now();
  let status = 'success';
  let errorMessage = null;
  let result = null;

  try {
    // Execute the actual API call
    result = await apiCallFunction();
    
  } catch (error) {
    status = 'failed';
    errorMessage = error.message;
    throw error; // Re-throw so calling code can handle it
    
  } finally {
    const responseTime = Date.now() - startTime;
    
    // Extract token usage if available (OpenAI format)
    const inputTokens = result?.usage?.prompt_tokens || 0;
    const outputTokens = result?.usage?.completion_tokens || 0;
    
    // Log to backend (don't await, fire and forget)
    logAPICall({
      providerName,
      endpoint,
      method,
      featureName,
      requestCount: 1,
      inputTokens,
      outputTokens,
      responseTime,
      status,
      errorMessage
    }).catch(err => {
      console.warn('Failed to log API call:', err.message);
    });
  }
  
  return result;
};

export default {
  logAPICall,
  bulkLogAPICalls,
  deleteAPILog,
  clearAllLogs,
  trackAPICall
};
