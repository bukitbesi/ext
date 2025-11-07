// ai-title-optimizer.js - Optimizes product titles using trending keywords
class AITitleOptimizer {
  static async optimizeTitle(title, locale = 'en') {
    try {
      // Load trending keywords
      const trendKeywords = await this.loadTrendKeywords(locale);
      
      // Extract existing keywords from title
      const titleKeywords = this.extractKeywords(title);
      
      // Find trending keywords that match the product
      const relevantTrends = this.findRelevantTrends(titleKeywords, trendKeywords);
      
      // Generate optimized title
      const optimizedTitle = this.generateOptimizedTitle(title, relevantTrends);
      
      // Log analytics
      if (typeof logAction !== 'undefined') {
        logAction('optimize', { originalTitle: title.substring(0, 20) });
      }
      
      return optimizedTitle;
    } catch (error) {
      console.error('Error optimizing title:', error);
      return title; // Return original if optimization fails
    }
  }

  static async loadTrendKeywords(locale) {
    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll use a mock implementation
      const response = await fetch(chrome.runtime.getURL('config/trend-keywords.json'));
      const data = await response.json();
      return data[locale] || data['en'];
    } catch (error) {
      console.warn('Failed to load trend keywords, using defaults');
      return ['hot', 'trending', 'new', 'best', 'sale', 'discount'];
    }
  }

  static extractKeywords(title) {
    return title.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  }

  static findRelevantTrends(titleKeywords, trendKeywords) {
    const relevant = [];
    for (const trend of trendKeywords) {
      for (const keyword of titleKeywords) {
        if (trend.includes(keyword) || keyword.includes(trend)) {
          relevant.push(trend);
          break;
        }
      }
    }
    return [...new Set(relevant)]; // Remove duplicates
  }

  static generateOptimizedTitle(originalTitle, trendKeywords) {
    // Simple algorithm: prepend trending keywords if not already present
    let optimized = originalTitle;
    
    for (const trend of trendKeywords.slice(0, 2)) { // Use top 2 trends
      if (!optimized.toLowerCase().includes(trend.toLowerCase())) {
        optimized = `${trend} ${optimized}`;
      }
    }
    
    // Ensure title isn't too long (Shopee limit is usually 120 chars)
    if (optimized.length > 120) {
      optimized = optimized.substring(0, 117) + '...';
    }
    
    return optimized;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AITitleOptimizer;
} else {
  window.AITitleOptimizer = AITitleOptimizer;
}