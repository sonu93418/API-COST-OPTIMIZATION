const APILog = require('../models/ApiLog');

/**
 * Optimization Suggestions Engine
 * Analyzes API usage patterns and provides optimization recommendations
 */
class OptimizationEngine {
  
  /**
   * Generate all optimization suggestions
   */
  static async generateSuggestions(days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const suggestions = [];

      // 1. Detect cacheable repeated requests
      const cacheableSuggestions = await this.detectCacheableRequests(startDate);
      suggestions.push(...cacheableSuggestions);

      // 2. Detect rate limiting opportunities
      const rateLimitSuggestions = await this.detectRateLimitOpportunities(startDate);
      suggestions.push(...rateLimitSuggestions);

      // 3. Detect batch processing opportunities
      const batchSuggestions = await this.detectBatchOpportunities(startDate);
      suggestions.push(...batchSuggestions);

      // 4. Detect duplicate calls
      const duplicateSuggestions = await this.detectDuplicateCalls(startDate);
      suggestions.push(...duplicateSuggestions);

      // 5. Detect slow response times
      const performanceSuggestions = await this.detectPerformanceIssues(startDate);
      suggestions.push(...performanceSuggestions);

      return suggestions;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  }

  /**
   * Detect requests that could benefit from caching
   */
  static async detectCacheableRequests(startDate) {
    const suggestions = [];

    const repeatCalls = await APILog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: 'success'
        }
      },
      {
        $group: {
          _id: {
            provider: '$providerName',
            endpoint: '$endpointName',
            feature: '$featureName'
          },
          count: { $sum: '$requestCount' },
          avgResponseTime: { $avg: '$responseTime' },
          totalCost: { $sum: '$calculatedCost' }
        }
      },
      {
        $match: {
          count: { $gte: 100 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    for (const call of repeatCalls) {
      const potentialSavings = call.totalCost * 0.7;
      suggestions.push({
        type: 'caching',
        priority: 'high',
        provider: call._id.provider,
        feature: call._id.feature,
        endpoint: call._id.endpoint,
        title: 'Implement Caching Strategy',
        description: `${call._id.provider} - ${call._id.endpoint} is called ${call.count} times. Implement Redis/in-memory caching to reduce API calls by 70%.`,
        impact: {
          currentCalls: call.count,
          estimatedReduction: Math.floor(call.count * 0.7),
          potentialSavings: `$${potentialSavings.toFixed(2)}`
        },
        recommendation: 'Add caching layer with TTL based on data freshness requirements'
      });
    }

    return suggestions;
  }

  /**
   * Detect rate limiting opportunities
   */
  static async detectRateLimitOpportunities(startDate) {
    const suggestions = [];

    const burstyCalls = await APILog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            provider: '$providerName',
            feature: '$featureName',
            hour: { $hour: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          hourlyCount: { $sum: '$requestCount' }
        }
      },
      {
        $group: {
          _id: {
            provider: '$_id.provider',
            feature: '$_id.feature'
          },
          avgHourly: { $avg: '$hourlyCount' },
          maxHourly: { $max: '$hourlyCount' }
        }
      },
      {
        $match: {
          $expr: { $gt: ['$maxHourly', { $multiply: ['$avgHourly', 5] }] }
        }
      }
    ]);

    for (const call of burstyCalls) {
      suggestions.push({
        type: 'rate-limiting',
        priority: 'medium',
        provider: call._id.provider,
        feature: call._id.feature,
        title: 'Implement Rate Limiting',
        description: `${call._id.feature} shows bursty API usage patterns. Peak usage is ${(call.maxHourly / call.avgHourly).toFixed(1)}x the average.`,
        impact: {
          avgHourly: Math.floor(call.avgHourly),
          maxHourly: call.maxHourly,
          ratio: (call.maxHourly / call.avgHourly).toFixed(2)
        },
        recommendation: 'Implement request throttling and queue mechanism to smooth out API calls'
      });
    }

    return suggestions;
  }

  /**
   * Detect batch processing opportunities
   */
  static async detectBatchOpportunities(startDate) {
    const suggestions = [];

    const rapidCalls = await APILog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $sort: { createdAt: 1 }
      },
      {
        $group: {
          _id: {
            provider: '$providerName',
            feature: '$featureName',
            minute: {
              $subtract: [
                '$createdAt',
                { $mod: [{ $toLong: '$createdAt' }, 60000] }
              ]
            }
          },
          count: { $sum: '$requestCount' }
        }
      },
      {
        $match: {
          count: { $gte: 10 }
        }
      },
      {
        $group: {
          _id: {
            provider: '$_id.provider',
            feature: '$_id.feature'
          },
          occurrences: { $sum: 1 },
          avgPerMinute: { $avg: '$count' }
        }
      },
      {
        $match: {
          occurrences: { $gte: 5 }
        }
      }
    ]);

    for (const call of rapidCalls) {
      suggestions.push({
        type: 'batching',
        priority: 'high',
        provider: call._id.provider,
        feature: call._id.feature,
        title: 'Use Batch API Requests',
        description: `${call._id.feature} makes ${Math.floor(call.avgPerMinute)} requests per minute. Use batch API endpoints if available.`,
        impact: {
          avgCallsPerMinute: Math.floor(call.avgPerMinute),
          estimatedBatchSize: Math.min(Math.floor(call.avgPerMinute), 100),
          potentialReduction: '90%'
        },
        recommendation: 'Aggregate multiple requests into batch API calls to reduce overhead and cost'
      });
    }

    return suggestions;
  }

  /**
   * Detect duplicate API calls
   */
  static async detectDuplicateCalls(startDate) {
    const suggestions = [];

    const duplicates = await APILog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: 'success'
        }
      },
      {
        $group: {
          _id: {
            provider: '$providerName',
            endpoint: '$endpointName',
            feature: '$featureName',
            requestBody: '$requestBody'
          },
          count: { $sum: 1 },
          totalCost: { $sum: '$calculatedCost' }
        }
      },
      {
        $match: {
          count: { $gte: 3 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 3
      }
    ]);

    for (const dup of duplicates) {
      if (dup._id.requestBody) {
        suggestions.push({
          type: 'duplicate-removal',
          priority: 'medium',
          provider: dup._id.provider,
          feature: dup._id.feature,
          title: 'Remove Duplicate API Calls',
          description: `Identical requests detected ${dup.count} times for ${dup._id.endpoint}. Implement request deduplication.`,
          impact: {
            duplicateCount: dup.count,
            wastedCost: `$${dup.totalCost.toFixed(2)}`
          },
          recommendation: 'Add request deduplication logic or short-term caching (5-10 seconds)'
        });
      }
    }

    return suggestions;
  }

  /**
   * Detect performance issues
   */
  static async detectPerformanceIssues(startDate) {
    const suggestions = [];

    const slowAPIs = await APILog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: 'success'
        }
      },
      {
        $group: {
          _id: {
            provider: '$providerName',
            endpoint: '$endpointName'
          },
          avgResponseTime: { $avg: '$responseTime' },
          count: { $sum: '$requestCount' }
        }
      },
      {
        $match: {
          avgResponseTime: { $gte: 2000 },
          count: { $gte: 10 }
        }
      },
      {
        $sort: { avgResponseTime: -1 }
      }
    ]);

    for (const slow of slowAPIs) {
      suggestions.push({
        type: 'performance',
        priority: 'medium',
        provider: slow._id.provider,
        endpoint: slow._id.endpoint,
        title: 'Optimize Slow API Calls',
        description: `${slow._id.endpoint} has average response time of ${(slow.avgResponseTime / 1000).toFixed(2)}s. Consider optimization.`,
        impact: {
          avgResponseTime: `${(slow.avgResponseTime / 1000).toFixed(2)}s`,
          callCount: slow.count
        },
        recommendation: 'Review request payload, use pagination, or implement async processing for heavy operations'
      });
    }

    return suggestions;
  }
}

module.exports = OptimizationEngine;
