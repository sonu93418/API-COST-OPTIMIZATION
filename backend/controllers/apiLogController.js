const APILog = require('../models/ApiLog');
const CostCalculator = require('../utils/costCalculator');
const PricingRule = require('../models/PricingRule');

// @desc    Log a new API call (REAL DATA)
// @route   POST /api/logs
// @access  Private
exports.logAPICall = async (req, res) => {
  try {
    const {
      providerName,
      endpoint,
      method,
      featureName,
      requestCount,
      inputTokens,
      outputTokens,
      responseTime,
      status,
      errorMessage
    } = req.body;

    // Validate required fields
    if (!providerName || !endpoint || !method || !featureName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: providerName, endpoint, method, featureName'
      });
    }

    // Get pricing rule for this provider/feature
    const pricingRule = await PricingRule.findOne({
      providerName,
      featureName
    });

    if (!pricingRule) {
      return res.status(404).json({
        success: false,
        error: `No pricing rule found for ${providerName} - ${featureName}`
      });
    }

    // Calculate cost
    const calculatedCost = CostCalculator.calculateCost(
      inputTokens || 0,
      outputTokens || 0,
      pricingRule.inputCostPer1k,
      pricingRule.outputCostPer1k
    );

    // Create API log entry
    const apiLog = await APILog.create({
      userId: req.user._id,
      providerName,
      endpoint,
      method,
      featureName,
      requestCount: requestCount || 1,
      inputTokens: inputTokens || 0,
      outputTokens: outputTokens || 0,
      totalTokens: (inputTokens || 0) + (outputTokens || 0),
      calculatedCost,
      responseTime: responseTime || 0,
      status: status || 'success',
      errorMessage: errorMessage || null
    });

    res.status(201).json({
      success: true,
      data: apiLog
    });
  } catch (error) {
    console.error('Error logging API call:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to log API call'
    });
  }
};

// @desc    Bulk log API calls (for batch operations)
// @route   POST /api/logs/bulk
// @access  Private
exports.bulkLogAPICalls = async (req, res) => {
  try {
    const { logs } = req.body;

    if (!Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'logs must be a non-empty array'
      });
    }

    const processedLogs = [];
    const errors = [];

    for (let i = 0; i < logs.length; i++) {
      try {
        const log = logs[i];
        
        // Get pricing rule
        const pricingRule = await PricingRule.findOne({
          providerName: log.providerName,
          featureName: log.featureName
        });

        if (!pricingRule) {
          errors.push({
            index: i,
            error: `No pricing rule found for ${log.providerName} - ${log.featureName}`
          });
          continue;
        }

        // Calculate cost
        const calculatedCost = CostCalculator.calculateCost(
          log.inputTokens || 0,
          log.outputTokens || 0,
          pricingRule.inputCostPer1k,
          pricingRule.outputCostPer1k
        );

        // Create log entry
        const apiLog = await APILog.create({
          userId: req.user._id,
          providerName: log.providerName,
          endpoint: log.endpoint,
          method: log.method,
          featureName: log.featureName,
          requestCount: log.requestCount || 1,
          inputTokens: log.inputTokens || 0,
          outputTokens: log.outputTokens || 0,
          totalTokens: (log.inputTokens || 0) + (log.outputTokens || 0),
          calculatedCost,
          responseTime: log.responseTime || 0,
          status: log.status || 'success',
          errorMessage: log.errorMessage || null
        });

        processedLogs.push(apiLog);
      } catch (error) {
        errors.push({
          index: i,
          error: error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      data: {
        processed: processedLogs.length,
        failed: errors.length,
        logs: processedLogs,
        errors: errors
      }
    });
  } catch (error) {
    console.error('Error in bulk logging:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process bulk logs'
    });
  }
};

// @desc    Delete an API log
// @route   DELETE /api/logs/:id
// @access  Private
exports.deleteAPILog = async (req, res) => {
  try {
    const apiLog = await APILog.findById(req.params.id);

    if (!apiLog) {
      return res.status(404).json({
        success: false,
        error: 'API log not found'
      });
    }

    // Check if user owns this log
    if (apiLog.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this log'
      });
    }

    await apiLog.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting API log:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete API log'
    });
  }
};

// @desc    Clear all logs for current user
// @route   DELETE /api/logs/clear
// @access  Private
exports.clearAllLogs = async (req, res) => {
  try {
    const result = await APILog.deleteMany({ userId: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    console.error('Error clearing logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear logs'
    });
  }
};
