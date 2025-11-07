// analytics/index.js - Tracks user actions and productivity metrics
class Analytics {
  static async logAction(action, details = {}) {
    try {
      const logEntry = {
        action,
        timestamp: new Date().toISOString(),
        details
      };

      // Get existing logs
      const result = await chrome.storage.local.get(['analyticsLogs']);
      const logs = result.analyticsLogs || [];
      
      // Add new log entry
      logs.push(logEntry);
      
      // Keep only last 100 entries
      if (logs.length > 100) {
        logs.shift();
      }
      
      // Save updated logs
      await chrome.storage.local.set({ analyticsLogs: logs });
      
      // For Pro users, optionally send to cloud analytics
      // This would require Firebase/Supabase integration
      // this.sendToCloud(logEntry);
    } catch (error) {
      console.error('Error logging action:', error);
    }
  }

  static async getAnalyticsSummary() {
    try {
      const result = await chrome.storage.local.get(['analyticsLogs']);
      const logs = result.analyticsLogs || [];
      
      // Calculate summary metrics
      const actions = {};
      const productsScraped = logs.filter(log => log.action === 'scrape').length;
      const titlesOptimized = logs.filter(log => log.action === 'optimize').length;
      
      logs.forEach(log => {
        actions[log.action] = (actions[log.action] || 0) + 1;
      });
      
      return {
        totalActions: logs.length,
        productsScraped,
        titlesOptimized,
        actionsByType: actions
      };
    } catch (error) {
      console.error('Error getting analytics summary:', error);
      return {};
    }
  }

  static async clearAnalytics() {
    try {
      await chrome.storage.local.remove(['analyticsLogs']);
    } catch (error) {
      console.error('Error clearing analytics:', error);
    }
  }
}

// Convenience function for modules
async function logAction(action, details) {
  return Analytics.logAction(action, details);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Analytics, logAction };
} else {
  window.Analytics = Analytics;
  window.logAction = logAction;
}