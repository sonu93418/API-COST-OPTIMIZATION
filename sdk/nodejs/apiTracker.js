/**
 * API Cost Tracker SDK for Node.js
 * Easily integrate API cost tracking into existing applications
 */

class APITracker {
  constructor(config) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
    this.companyId = config.companyId;
    this.userId = config.userId;
  }

  /**
   * Track an API call with automatic cost calculation
   */
  async track(options) {
    const startTime = Date.now();
    
    try {
      // Execute the actual API call
      const result = await options.apiCall();
      const endTime = Date.now();
      
      // Log successful call
      await this.logCall({
        providerName: options.providerName,
        endpointName: options.endpointName,
        featureName: options.featureName,
        method: options.method || 'POST',
        responseTime: endTime - startTime,
        status: 'success',
        userId: options.userId || this.userId,
        inputTokens: this.extractTokens(result, 'input'),
        outputTokens: this.extractTokens(result, 'output'),
        requestCount: options.requestCount || 1
      });

      return {
        data: result,
        cost: await this.calculateCost(options.providerName, result),
        responseTime: endTime - startTime,
        success: true
      };

    } catch (error) {
      const endTime = Date.now();
      
      // Log failed call
      await this.logCall({
        providerName: options.providerName,
        endpointName: options.endpointName,
        featureName: options.featureName,
        method: options.method || 'POST',
        responseTime: endTime - startTime,
        status: 'failed',
        userId: options.userId || this.userId,
        errorMessage: error.message,
        requestCount: options.requestCount || 1
      });

      throw error;
    }
  }

  /**
   * Log API call data to the cost optimization platform
   */
  async logCall(data) {
    try {
      const response = await fetch(`${this.apiUrl}/api/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Company-ID': this.companyId
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          companyId: this.companyId
        })
      });

      if (!response.ok) {
        console.error('Failed to log API call:', response.statusText);
      }
    } catch (error) {
      console.error('Error logging API call:', error.message);
      // Don't throw - logging failures shouldn't break the main application
    }
  }

  /**
   * Extract token usage from API response (works with OpenAI, Anthropic, etc.)
   */
  extractTokens(result, type) {
    if (result.usage) {
      return type === 'input' ? result.usage.prompt_tokens : result.usage.completion_tokens;
    }
    return 0;
  }

  /**
   * Calculate estimated cost (can be overridden with server-side calculation)
   */
  async calculateCost(provider, result) {
    // This is a simplified version - real calculation happens on server
    const rates = {
      'OpenAI': 0.002,
      'Anthropic': 0.003,
      'Google': 0.001
    };
    
    return rates[provider] || 0;
  }
}

module.exports = APITracker;