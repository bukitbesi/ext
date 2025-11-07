// dashboard.js - Main logic for the dashboard interface
document.addEventListener('DOMContentLoaded', async function() {
  // Set up tab navigation
  setupTabs();
  
  // Load initial data
  await loadHistory();
  
  // Set up event listeners
  document.getElementById('optimize-title-btn').addEventListener('click', optimizeTitle);
  document.getElementById('sync-supplier-btn').addEventListener('click', syncSupplier);
  document.getElementById('find-trends-btn').addEventListener('click', findTrends);
  
  // Set up export buttons
  document.querySelectorAll('.export-btn').forEach(button => {
    button.addEventListener('click', () => exportData(button.dataset.format));
  });
});

function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panes = document.querySelectorAll('.tab-pane');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and panes
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Show corresponding pane
      const tabId = tab.dataset.tab;
      document.getElementById(tabId).classList.add('active');
    });
  });
}

async function loadHistory() {
  try {
    const result = await chrome.storage.local.get(['analyticsLogs']);
    const logs = result.analyticsLogs || [];
    
    const historyList = document.getElementById('history-list');
    
    if (logs.length === 0) {
      historyList.innerHTML = '<p>No activity yet. Start scraping products!</p>';
      return;
    }
    
    // Filter scrape actions
    const scrapeLogs = logs.filter(log => log.action === 'scrape');
    
    if (scrapeLogs.length === 0) {
      historyList.innerHTML = '<p>No products scraped yet.</p>';
      return;
    }
    
    // Create history list
    let html = '<div class="history-items">';
    scrapeLogs.slice(-10).reverse().forEach(log => {
      html += `
        <div class="history-item">
          <div class="history-title">${log.details.productId || 'Unknown Product'}</div>
          <div class="history-time">${new Date(log.timestamp).toLocaleString()}</div>
        </div>
      `;
    });
    html += '</div>';
    
    historyList.innerHTML = html;
  } catch (error) {
    console.error('Error loading history:', error);
    document.getElementById('history-list').innerHTML = '<p>Error loading history.</p>';
  }
}

async function optimizeTitle() {
  try {
    const titleInput = document.getElementById('product-title');
    const title = titleInput.value.trim();
    
    if (!title) {
      showResult('optimizer', 'Please enter a product title.', 'error');
      return;
    }
    
    showResult('optimizer', 'Optimizing title...', 'info');
    
    const optimized = await AITitleOptimizer.optimizeTitle(title);
    showResult('optimizer', `Optimized title: ${optimized}`, 'success');
  } catch (error) {
    console.error('Error optimizing title:', error);
    showResult('optimizer', 'Error optimizing title. Please try again.', 'error');
  }
}

async function syncSupplier() {
  try {
    const urlInput = document.getElementById('supplier-url');
    const url = urlInput.value.trim();
    
    if (!url) {
      showResult('supplier', 'Please enter a supplier URL.', 'error');
      return;
    }
    
    showResult('supplier', 'Syncing supplier data...', 'info');
    
    const supplierData = await StockChecker.loadSupplierData();
    showResult('supplier', `Synced ${Object.keys(supplierData).length} products from supplier.`, 'success');
  } catch (error) {
    console.error('Error syncing supplier:', error);
    showResult('supplier', 'Error syncing supplier data. Please try again.', 'error');
  }
}

async function findTrends() {
  try {
    const categorySelect = document.getElementById('category-select');
    const category = categorySelect.value;
    
    showResult('trends', 'Finding trending products...', 'info');
    
    const trends = await TrendSniper.getHotProductsByCategory(category);
    
    if (trends.length === 0) {
      showResult('trends', 'No trending products found for this category.', 'info');
      return;
    }
    
    let html = '<div class="trend-list">';
    trends.forEach(trend => {
      html += `
        <div class="trend-item">
          <div class="trend-name">${trend.name}</div>
          <div class="trend-stats">
            <span class="rise">Rise: ${trend.rise}%</span>
            <span class="margin">Margin: ${trend.margin}%</span>
          </div>
        </div>
      `;
    });
    html += '</div>';
    
    showResult('trends', html, 'success');
  } catch (error) {
    console.error('Error finding trends:', error);
    showResult('trends', 'Error finding trends. Please try again.', 'error');
  }
}

async function exportData(format) {
  try {
    showResult('export', `Exporting as ${format.toUpperCase()}...`, 'info');
    
    const result = await chrome.storage.local.get(['currentProduct']);
    const product = result.currentProduct;
    
    if (!product) {
      showResult('export', 'Please scrape a product first.', 'error');
      return;
    }
    
    const response = await fetch(chrome.runtime.getURL('scripts/post-rebuilder.js'));
    const text = await response.text();
    eval(text);
    
    let content, filename, contentType;
    
    switch (format) {
      case 'json':
        content = await PostRebuilder.rebuildToJSON(product);
        filename = 'product.json';
        contentType = 'application/json';
        break;
      case 'csv':
        content = await PostRebuilder.rebuildToCSV(product);
        filename = 'product.csv';
        contentType = 'text/csv';
        break;
      case 'html':
        content = await PostRebuilder.rebuildToHTML(product);
        filename = 'product.html';
        contentType = 'text/html';
        break;
      case 'whatsapp':
        content = await PostRebuilder.rebuildToWhatsApp(product);
        filename = 'product_whatsapp.json';
        contentType = 'application/json';
        break;
      default:
        throw new Error('Unsupported format');
    }
    
    // Download file
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showResult('export', `Exported as ${format.toUpperCase()} successfully!`, 'success');
  } catch (error) {
    console.error('Error exporting ', error);
    showResult('export', 'Error exporting data. Please try again.', 'error');
  }
}

function showResult(section, message, type) {
  const resultElement = document.getElementById(`${section}-result`);
  resultElement.innerHTML = message;
  resultElement.className = `result-box ${type}`;
}