// Background service worker
chrome.runtime.onInstalled.addListener(async () => {
  console.log('ShopeeExtensionPro installed');
  
  try {
    // Initialize storage
    await chrome.storage.local.set({
      analyticsLogs: [],
      currentProduct: null
    });
  } catch (error) {
    console.error('Failed to initialize storage:', error);
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'logAction') {
    try {
      // Import analytics module
      importScripts('analytics/index.js');
      
      // Log the action
      Analytics.logAction(request.details.action, request.details.data);
      
      sendResponse({ success: true });
    } catch (error) {
      console.error('Failed to log action:', error);
      sendResponse({ success: false, error: error.message });
    }
    // Return true to indicate we'll send response asynchronously
    return true;
  }
});