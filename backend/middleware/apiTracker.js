const APILog = require('../models/APILog');
const axios = require('axios');
const CostCalculator = require('../utils/costCalculator');

/**
 * API Tracking Middleware
 * Intercepts external API calls and logs them with cost calculation
 */
class APITracker {
  
  /**
   * Track external API call
   * Usage: await APITracker.track(config)
   */
  static async track(config) {
    const startTime = Date.now();
    let logData = {
      providerName: config.providerName,
      endpointName: config.endpointName,
      featureName: config.featureName,
      requestCount: config.requestCount || 1,
      userId: config.userId,
      serviceIdentifier: config.serviceIdentifier
    };

    try {
      // Make the actual API call
      const response = await axios({
        method: config.method || 'GET',
        url: config.url,
        headers: config.headers,
        data: config.data,
        params: config.params,
        timeout: config.timeout || 30000
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Calculate cost
      const calculatedCost = await CostCalculator.calculateCost(
        config.providerName, 
        config.requestCount || 1
      );

      // Log the successful API call
      logData = {
        ...logData,
        responseTime,
        status: 'success',
        statusCode: response.status,
        calculatedCost,
        responseSize: JSON.stringify(response.data).length,
        requestBody: config.logRequestBody ? config.data : undefined
      };

      await APILog.create(logData);

      return {
        success: true,
        data: response.data,
        cost: calculatedCost,
        responseTime
      };

    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Log the failed API call
      logData = {
        ...logData,
        responseTime,
        status: error.response ? 'failure' : 'error',
        statusCode: error.response?.status,
        calculatedCost: 0,
        errorMessage: error.message,
        requestBody: config.logRequestBody ? config.data : undefined
      };

      await APILog.create(logData);

      throw error;
    }
  }

  /**
   * Express middleware wrapper for tracking
   * Adds tracking capability to req object
   */
  static middleware() {
    return (req, res, next) => {
      req.trackAPI = async (config) => {
        return await APITracker.track({
          ...config,
          userId: req.user?.id
        });
      };
      next();
    };
  }
}

module.exports = APITracker;
