const Alert = require('../models/Alert');
const AnomalyDetector = require('../utils/anomalyDetector');

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Private
exports.getAlerts = async (req, res) => {
  try {
    const { isRead, isResolved, type, severity } = req.query;
    
    const query = {};
    if (isRead !== undefined) query.isRead = isRead === 'true';
    if (isResolved !== undefined) query.isResolved = isResolved === 'true';
    if (type) query.type = type;
    if (severity) query.severity = severity;

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching alerts',
      error: error.message
    });
  }
};

// @desc    Mark alert as read
// @route   PUT /api/alerts/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating alert',
      error: error.message
    });
  }
};

// @desc    Mark alert as resolved
// @route   PUT /api/alerts/:id/resolve
// @access  Private
exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { 
        isResolved: true,
        resolvedAt: new Date(),
        resolvedBy: req.user.id
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resolving alert',
      error: error.message
    });
  }
};

// @desc    Run anomaly detection manually
// @route   POST /api/alerts/detect
// @access  Private/Admin
exports.detectAnomalies = async (req, res) => {
  try {
    const results = await AnomalyDetector.runAllChecks();

    res.status(200).json({
      success: true,
      message: `Detection complete. Found ${results.total} new alerts.`,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error running anomaly detection',
      error: error.message
    });
  }
};

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Private/Admin
exports.deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alert deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting alert',
      error: error.message
    });
  }
};
