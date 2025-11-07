// stock-checker.js - Compares product stock with supplier data
class StockChecker {
  static async checkStockMismatch(productSku, supplierData) {
    try {
      // In a real implementation, this would compare with actual supplier data
      // For now, we'll use a mock implementation
      const mismatches = [];
      
      const supplierStock = supplierData[productSku];

      if (!supplierStock) {
        console.warn(`No supplier data found for SKU: ${productSku}`);
        return mismatches; // or handle as needed
      }

      // Mock supplier data check
      if (supplierStock.quantity < 5) {
        mismatches.push({
          sku: productSku,
          supplierStock: supplierStock.quantity,
          message: `Low stock alert: Only ${supplierStock.quantity} units available`
        });
      }

      // Log analytics
      if (typeof logAction !== 'undefined') {
        // Consider: Add error handling around logAction in case it fails
        logAction('stock_check', { sku: productSku });
      }
      
      return mismatches;
    } catch (error) {
      console.error('Error checking stock:', error);
      return [];
    }
  }

  static async loadSupplierData() {
    try {
      const response = await fetch(chrome.runtime.getURL('config/supplier-config.json'));

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Supplier data loaded successfully:', data);
      return data;
    } catch (error) {
      console.warn('Failed to load supplier data');
      return {};
    }
  }

  static shouldHideProduct(mismatches) {
    // Hide if critical stock mismatch
    return mismatches.some(m => m.supplierStock === 0); // Consider:  Maybe make this configurable?
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StockChecker;
} else {
  window.StockChecker = StockChecker;
}