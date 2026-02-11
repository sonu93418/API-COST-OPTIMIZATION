/**
 * React SDK for API Cost Tracking
 * Hook-based integration for React applications
 */

import React, { createContext, useContext, useState } from 'react';

// Context for API tracking configuration
const APITrackerContext = createContext();

export const APITrackerProvider = ({ children, config }) => {
  const [trackingData, setTrackingData] = useState({
    totalCalls: 0,
    totalCost: 0,
    recentCalls: []
  });

  const tracker = new APITracker(config);

  return (
    <APITrackerContext.Provider value={{ tracker, trackingData, setTrackingData }}>
      {children}
    </APITrackerContext.Provider>
  );
};

export const useAPITracker = () => {
  const context = useContext(APITrackerContext);
  if (!context) {
    throw new Error('useAPITracker must be used within APITrackerProvider');
  }
  
  const { tracker, trackingData, setTrackingData } = context;

  const trackCall = async (options) => {
    const result = await tracker.track(options);
    
    // Update local state for real-time UI updates
    setTrackingData(prev => ({
      totalCalls: prev.totalCalls + 1,
      totalCost: prev.totalCost + result.cost,
      recentCalls: [
        {
          provider: options.providerName,
          feature: options.featureName,
          cost: result.cost,
          timestamp: new Date(),
          success: result.success
        },
        ...prev.recentCalls.slice(0, 9) // Keep last 10 calls
      ]
    }));

    return result;
  };

  return {
    trackCall,
    trackingData,
    resetTracking: () => setTrackingData({ totalCalls: 0, totalCost: 0, recentCalls: [] })
  };
};

// API Tracker class for React
class APITracker {
  constructor(config) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
    this.companyId = config.companyId;
  }

  async track(options) {
    const startTime = Date.now();
    
    try {
      const result = await options.apiCall();
      const endTime = Date.now();
      
      await this.logCall({
        providerName: options.providerName,
        endpointName: options.endpointName || 'unknown',
        featureName: options.featureName,
        responseTime: endTime - startTime,
        status: 'success'
      });

      return {
        data: result,
        cost: Math.random() * 0.01, // Simplified for demo
        responseTime: endTime - startTime,
        success: true
      };

    } catch (error) {
      const endTime = Date.now();
      
      await this.logCall({
        providerName: options.providerName,
        endpointName: options.endpointName || 'unknown',
        featureName: options.featureName,
        responseTime: endTime - startTime,
        status: 'failed',
        errorMessage: error.message
      });

      throw error;
    }
  }

  async logCall(data) {
    try {
      await fetch(`${this.apiUrl}/api/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Company-ID': this.companyId
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Failed to log API call:', error);
    }
  }
}

// Component for displaying real-time tracking data
export const APITrackingWidget = () => {
  const { trackingData } = useAPITracker();

  return (
    <div className="api-tracking-widget p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">API Usage (Session)</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Total Calls</p>
          <p className="text-xl font-bold">{trackingData.totalCalls}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Cost</p>
          <p className="text-xl font-bold">${trackingData.totalCost.toFixed(4)}</p>
        </div>
      </div>
      
      <div>
        <p className="text-sm font-medium mb-2">Recent Calls:</p>
        {trackingData.recentCalls.map((call, index) => (
          <div key={index} className="flex justify-between text-xs mb-1">
            <span className={`px-2 py-1 rounded ${call.success ? 'bg-green-100' : 'bg-red-100'}`}>
              {call.provider} - {call.feature}
            </span>
            <span>${call.cost.toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default { APITrackerProvider, useAPITracker, APITrackingWidget };