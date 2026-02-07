const APILog = require('../models/ApiLog');
const Alert = require('../models/Alert');

/**
 * Anomaly Detection Service
 * Detects usage spikes and abnormal patterns
 */
class AnomalyDetector {
  
  /**
   * Detect API usage spikes
   */
  static async detectSpikes() {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Get current hour usage by provider
      const currentHourUsage = await APILog.aggregate([
        {
          $match: {
            createdAt: { $gte: oneHourAgo }
          }
        },
        {
          $group: {
            _id: '$providerName',
            hourlyRequests: { $sum: '$requestCount' }
          }
        }
      ]);

      // Get average hourly usage from past 24 hours
      const pastDayUsage = await APILog.aggregate([
        {
          $match: {
            createdAt: { $gte: oneDayAgo, $lt: oneHourAgo }
          }
        },
        {
          $group: {
            _id: '$providerName',
            totalRequests: { $sum: '$requestCount' }
          }
        }
      ]);

      const alerts = [];
      const spikeThreshold = parseFloat(process.env.ALERT_SPIKE_THRESHOLD) || 3;

      for (const current of currentHourUsage) {
        const past = pastDayUsage.find(p => p._id === current._id);
        if (past) {
          const avgHourlyRequests = past.totalRequests / 23;
          const increaseRatio = current.hourlyRequests / avgHourlyRequests;

          if (increaseRatio >= spikeThreshold) {
            const percentIncrease = ((increaseRatio - 1) * 100).toFixed(0);
            
            // Check if alert already exists
            const existingAlert = await Alert.findOne({
              type: 'spike',
              providerName: current._id,
              isResolved: false,
              createdAt: { $gte: oneHourAgo }
            });

            if (!existingAlert) {
              const alert = await Alert.create({
                type: 'spike',
                severity: increaseRatio >= 5 ? 'critical' : 'high',
                providerName: current._id,
                title: `${current._id} Usage Spike Detected`,
                message: `${current._id} API usage increased by ${percentIncrease}% in the last hour (${current.hourlyRequests} requests vs avg ${avgHourlyRequests.toFixed(0)})`,
                metadata: {
                  currentHourRequests: current.hourlyRequests,
                  avgHourlyRequests: avgHourlyRequests.toFixed(2),
                  increaseRatio: increaseRatio.toFixed(2)
                }
              });
              alerts.push(alert);
            }
          }
        }
      }

      return alerts;
    } catch (error) {
      console.error('Error detecting spikes:', error);
      return [];
    }
  }

  /**
   * Check budget thresholds
   */
  static async checkBudgets() {
    try {
      const Budget = require('../models/Budget');
      const alerts = [];

      const now = new Date();
      const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      const budgets = await Budget.find({ 
        isActive: true,
        period: currentPeriod
      });

      for (const budget of budgets) {
        const percentage = (budget.currentSpend / budget.monthlyLimit) * 100;

        if (percentage >= budget.alertThreshold) {
          // Check if alert already exists
          const existingAlert = await Alert.findOne({
            type: 'budget',
            providerName: budget.providerName,
            isResolved: false,
            'metadata.period': currentPeriod
          });

          if (!existingAlert) {
            let severity = 'medium';
            if (percentage >= 100) severity = 'critical';
            else if (percentage >= 90) severity = 'high';

            const alert = await Alert.create({
              type: 'budget',
              severity,
              providerName: budget.providerName,
              title: `Budget Alert: ${budget.providerName}`,
              message: `${budget.providerName} has used ${percentage.toFixed(1)}% of monthly budget ($${budget.currentSpend.toFixed(2)} / $${budget.monthlyLimit})`,
              metadata: {
                currentSpend: budget.currentSpend,
                monthlyLimit: budget.monthlyLimit,
                percentage: percentage.toFixed(2),
                period: currentPeriod
              }
            });
            alerts.push(alert);
          }
        }
      }

      return alerts;
    } catch (error) {
      console.error('Error checking budgets:', error);
      return [];
    }
  }

  /**
   * Detect high error rates
   */
  static async detectHighErrorRates() {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const alerts = [];

      const errorRates = await APILog.aggregate([
        {
          $match: {
            createdAt: { $gte: oneHourAgo }
          }
        },
        {
          $group: {
            _id: '$providerName',
            totalRequests: { $sum: '$requestCount' },
            failedRequests: {
              $sum: {
                $cond: [{ $ne: ['$status', 'success'] }, '$requestCount', 0]
              }
            }
          }
        }
      ]);

      for (const rate of errorRates) {
        const errorRate = (rate.failedRequests / rate.totalRequests) * 100;

        if (errorRate >= 20 && rate.totalRequests >= 10) {
          const existingAlert = await Alert.findOne({
            type: 'error',
            providerName: rate._id,
            isResolved: false,
            createdAt: { $gte: oneHourAgo }
          });

          if (!existingAlert) {
            const alert = await Alert.create({
              type: 'error',
              severity: errorRate >= 50 ? 'critical' : 'high',
              providerName: rate._id,
              title: `High Error Rate: ${rate._id}`,
              message: `${rate._id} API has ${errorRate.toFixed(1)}% error rate (${rate.failedRequests}/${rate.totalRequests} requests failed)`,
              metadata: {
                totalRequests: rate.totalRequests,
                failedRequests: rate.failedRequests,
                errorRate: errorRate.toFixed(2)
              }
            });
            alerts.push(alert);
          }
        }
      }

      return alerts;
    } catch (error) {
      console.error('Error detecting high error rates:', error);
      return [];
    }
  }

  /**
   * Run all anomaly checks
   */
  static async runAllChecks() {
    const spikeAlerts = await this.detectSpikes();
    const budgetAlerts = await this.checkBudgets();
    const errorAlerts = await this.detectHighErrorRates();

    return {
      spikes: spikeAlerts,
      budgets: budgetAlerts,
      errors: errorAlerts,
      total: spikeAlerts.length + budgetAlerts.length + errorAlerts.length
    };
  }
}

module.exports = AnomalyDetector;
