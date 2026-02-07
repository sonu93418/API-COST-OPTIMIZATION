const APILog = require('../models/APILog');
const CostCalculator = require('../utils/costCalculator');

// @desc    Get analytics dashboard data
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {
  try {
    const { startDate, endDate, provider, feature } = req.query;

    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(1));
    const end = endDate ? new Date(endDate) : new Date();

    const matchQuery = {
      createdAt: { $gte: start, $lte: end }
    };

    if (provider) matchQuery.providerName = provider;
    if (feature) matchQuery.featureName = feature;

    // Total metrics
    const totalMetrics = await APILog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalCost: { $sum: '$calculatedCost' },
          totalRequests: { $sum: '$requestCount' },
          successCount: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, '$requestCount', 0] }
          },
          failureCount: {
            $sum: { $cond: [{ $ne: ['$status', 'success'] }, '$requestCount', 0] }
          },
          avgResponseTime: { $avg: '$responseTime' }
        }
      }
    ]);

    // Cost by provider
    const costByProvider = await CostCalculator.getCostByProvider(start, end);

    // Cost by feature
    const costByFeature = await CostCalculator.getCostByFeature(start, end);

    // Daily trends
    const dailyTrends = await CostCalculator.getDailyCostTrend(start, end);

    // Top expensive APIs
    const topExpensive = costByProvider.slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        totalMetrics: totalMetrics[0] || {
          totalCost: 0,
          totalRequests: 0,
          successCount: 0,
          failureCount: 0,
          avgResponseTime: 0
        },
        costByProvider,
        costByFeature,
        dailyTrends,
        topExpensive
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

// @desc    Get API logs with filters
// @route   GET /api/analytics/logs
// @access  Private
exports.getLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      provider, 
      feature, 
      status, 
      startDate, 
      endDate 
    } = req.query;

    const query = {};
    
    if (provider) query.providerName = provider;
    if (feature) query.featureName = feature;
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await APILog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('userId', 'name email');

    const total = await APILog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching logs',
      error: error.message
    });
  }
};

// @desc    Get cost trends
// @route   GET /api/analytics/cost-trends
// @access  Private
exports.getCostTrends = async (req, res) => {
  try {
    const { period = 'daily', days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    const endDate = new Date();

    let groupBy;
    if (period === 'hourly') {
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
        hour: { $hour: '$createdAt' }
      };
    } else if (period === 'weekly') {
      groupBy = {
        year: { $year: '$createdAt' },
        week: { $week: '$createdAt' }
      };
    } else {
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
    }

    const trends = await APILog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          totalCost: { $sum: '$calculatedCost' },
          totalRequests: { $sum: '$requestCount' },
          avgResponseTime: { $avg: '$responseTime' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cost trends',
      error: error.message
    });
  }
};

// @desc    Get provider list
// @route   GET /api/analytics/providers
// @access  Private
exports.getProviders = async (req, res) => {
  try {
    const providers = await APILog.distinct('providerName');
    res.status(200).json({
      success: true,
      data: providers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching providers',
      error: error.message
    });
  }
};

// @desc    Get feature list
// @route   GET /api/analytics/features
// @access  Private
exports.getFeatures = async (req, res) => {
  try {
    const features = await APILog.distinct('featureName');
    res.status(200).json({
      success: true,
      data: features
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching features',
      error: error.message
    });
  }
};
