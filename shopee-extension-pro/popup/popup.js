// popup.js - Main logic for the popup interface
document.addEventListener('DOMContentLoaded', async function() {
  // Load current product if exists
  await loadCurrentProduct();
  
  // Set up event listeners
  document.getElementById('scrape-btn').addEventListener('click', scrapeProduct);
  document.getElementById('optimize-btn').addEventListener('click', optimizeTitle);
  document.getElementById('export-btn').addEventListener('click', exportData);
  document.getElementById('dashboard-btn').addEventListener('click', openDashboard);
});

async function loadCurrentProduct() {
  try {
    const result = await chrome.storage.local.get(['currentProduct']);
    const product = result.currentProduct;
    
    if (product) {
      const previewContent = document.getElementById('preview-content');
      previewContent.innerHTML = `
        <h3>${product.title || 'No title'}</h3>
        <p>Price: ${product.price || 'N/A'}</p>
        <p>Rating: ${product.rating || 'N/A'}</p>
        <p>Categories: ${(product.categories || []).join(', ') || 'None'}</p>
      `;
    }
  } catch (error) {
    console.error('Error loading product:', error);
  }
}

async function scrapeProduct() {
  try {
    showStatus('Scraping product...', 'info');
    
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Execute scraper script
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['scripts/shopee-scraper.js']
    });
    
    if (results && results[0] && results[0].result) {
      const product = results[0].result;
      if (product) {
        await chrome.storage.local.set({ currentProduct: product });
        await loadCurrentProduct();
        showStatus('Product scraped successfully!', 'success');
      } else {
        showStatus('Failed to scrape product. Please try again.', 'error');
      }
    } else {
      showStatus('Failed to scrape product. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error scraping product:', error);
    showStatus('Error scraping product. Please try again.', 'error');
  }
}

async function optimizeTitle() {
  try {
    showStatus('Optimizing title...', 'info');
    
    const result = await chrome.storage.local.get(['currentProduct']);
    const product = result.currentProduct;
    
    if (!product) {
      showStatus('Please scrape a product first.', 'error');
      return;
    }
    
    // Execute optimizer script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async (product) => {
        // Import AITitleOptimizer
        const response = await fetch(chrome.runtime.getURL('scripts/ai-title-optimizer.js'));
        const text = await response.text();
        eval(text);
        
        return await AITitleOptimizer.optimizeTitle(product.title);
      },
      args: [product]
    });
    
    if (results && results[0] && results[0].result) {
      const optimizedTitle = results[0].result;
      product.title = optimizedTitle;
      await chrome.storage.local.set({ currentProduct: product });
      await loadCurrentProduct();
      showStatus('Title optimized successfully!', 'success');
    } else {
      showStatus('Failed to optimize title.', 'error');
    }
  } catch (error) {
    console.error('Error optimizing title:', error);
    showStatus('Error optimizing title. Please try again.', 'error');
  }
}

async function exportData() {
  try {
    showStatus('Exporting data...', 'info');
    
    const result = await chrome.storage.local.get(['currentProduct']);
    const product = result.currentProduct;
    
    if (!product) {
      showStatus('Please scrape a product first.', 'error');
      return;
    }
    
    // Import PostRebuilder
    const response = await fetch(chrome.runtime.getURL('scripts/post-rebuilder.js'));
    const text = await response.text();
    eval(text);
    
    // Export as JSON by default
    const json = await PostRebuilder.rebuildToJSON(product);
    
    // Copy to clipboard
    await navigator.clipboard.writeText(json);
    
    showStatus('Product data copied to clipboard!', 'success');
  } catch (error) {
    console.error('Error exporting ', error);
    showStatus('Error exporting data. Please try again.', 'error');
  }
}

function openDashboard() {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
}

function showStatus(message, type) {
  const statusElement = document.getElementById('status');
  statusElement.textContent = message;
  statusElement.className = `status ${type}`;
  
  // Clear status after 3 seconds
  setTimeout(() => {
    statusElement.textContent = '';
    statusElement.className = 'status';
  }, 3000);
}