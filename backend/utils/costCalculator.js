const APILog = require('../models/ApiLog');
const PricingRule = require('../models/PricingRule');

/**
 * Cost Calculation Engine
 * Calculates the cost of an API call based on pricing rules and tier pricing
 */
class CostCalculator {
  
  /**
   * Calculate cost for a single API call
   */
  static async calculateCost(providerName, requestCount = 1) {
    try {
      const pricingRule = await PricingRule.findOne({ 
        providerName, 
        isActive: true 
      });

      if (!pricingRule) {
        return 0;
      }

      // Check if within free tier
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthlyUsage = await APILog.aggregate([
        {
          $match: {
            providerName,
            createdAt: { $gte: monthStart }
          }
        },
        {
          $group: {
            _id: null,
            totalRequests: { $sum: '$requestCount' }
          }
        }
      ]);

      const currentMonthRequests = monthlyUsage[0]?.totalRequests || 0;
      const remainingFreeRequests = Math.max(0, pricingRule.freeTierLimit - currentMonthRequests);

      // Calculate cost
      let cost = 0;
      let billableRequests = Math.max(0, requestCount - remainingFreeRequests);

      if (billableRequests > 0) {
        // Check if tier pricing exists
        if (pricingRule.tierPricing && pricingRule.tierPricing.length > 0) {
          cost = this.calculateTierPricing(billableRequests, pricingRule.tierPricing);
        } else {
          cost = billableRequests * pricingRule.costPerRequest;
        }
      }

      return parseFloat(cost.toFixed(6));
    } catch (error) {
      console.error('Cost calculation error:', error);
      return 0;
    }
  }

  /**
   * Calculate cost using tier pricing
   */
  static calculateTierPricing(requests, tiers) {
    let cost = 0;
    let remainingRequests = requests;

    const sortedTiers = tiers.sort((a, b) => a.from - b.from);

    for (const tier of sortedTiers) {
      const tierSize = tier.to ? tier.to - tier.from + 1 : Infinity;
      const requestsInTier = Math.min(remainingRequests, tierSize);
      
      cost += requestsInTier * tier.costPerRequest;
      remainingRequests -= requestsInTier;

      if (remainingRequests <= 0) break;
    }

    return cost;
  }

  /**
   * Get cost summary by provider
   */
  static async getCostByProvider(startDate, endDate) {
    try {
      const logs = await APILog.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: '$providerName',
            totalCost: { $sum: '$calculatedCost' },
            totalRequests: { $sum: '$requestCount' },
            successCount: {
              $sum: { $cond: [{ $eq: ['$status', 'success'] }, '$requestCount', 0] }
            },
            failureCount: {
              $sum: { $cond: [{ $ne: ['$status', 'success'] }, '$requestCount', 0] }
            }
          }
        },
        {
          $sort: { totalCost: -1 }
        }
      ]);

      return logs;
    } catch (error) {
      console.error('Error calculating cost by provider:', error);
      throw error;
    }
  }

  /**
   * Get cost summary by feature/module
   */
  static async getCostByFeature(startDate, endDate) {
    try {
      const logs = await APILog.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              feature: '$featureName',
              provider: '$providerName'
            },
            totalCost: { $sum: '$calculatedCost' },
            totalRequests: { $sum: '$requestCount' }
          }
        },
        {
          $sort: { totalCost: -1 }
        }
      ]);

      return logs;
    } catch (error) {
      console.error('Error calculating cost by feature:', error);
      throw error;
    }
  }

  /**
   * Get daily cost trends
   */
  static async getDailyCostTrend(startDate, endDate) {
    try {
      const logs = await APILog.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            totalCost: { $sum: '$calculatedCost' },
            totalRequests: { $sum: '$requestCount' }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
      ]);

      return logs.map(log => ({
        date: new Date(log._id.year, log._id.month - 1, log._id.day),
        totalCost: log.totalCost,
        totalRequests: log.totalRequests
      }));
    } catch (error) {
      console.error('Error calculating daily cost trend:', error);
      throw error;
    }
  }
}

module.exports = CostCalculator;
