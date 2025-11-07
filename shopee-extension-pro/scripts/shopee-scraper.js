// shopee-scraper.js - Scrapes product data from Shopee pages
async function scrapeShopeeProduct() {
  try {
    // Determine language based on page content
    const lang = detectLanguage();
    const selectors = SELECTOR_MAP[lang] || SELECTOR_MAP.en;
    
    // Scrape basic product data
    const product = {
      title: getElementText(selectors.title) || getElementTextFallback(FALLBACK_SELECTORS.title),
      price: getElementText(selectors.price) || getElementTextFallback(FALLBACK_SELECTORS.price),
      discount: getElementText(selectors.discount) || getElementTextFallback(FALLBACK_SELECTORS.discount),
      variants: getVariants(selectors.variants) || getVariantsFallback(FALLBACK_SELECTORS.variants),
      images: getImages(selectors.images) || getImagesFallback(FALLBACK_SELECTORS.images),
      videos: getVideos(selectors.videos) || getVideosFallback(FALLBACK_SELECTORS.videos),
      rating: getElementText(selectors.rating) || getElementTextFallback(FALLBACK_SELECTORS.rating),
      categories: getCategories(selectors.categories) || getCategoriesFallback(FALLBACK_SELECTORS.categories),
      url: window.location.href,
      scrapedAt: new Date().toISOString()
    };

    // Store in chrome storage
    await chrome.storage.local.set({ currentProduct: product });
    
    // Log analytics
    if (typeof logAction !== 'undefined') {
      logAction('scrape', { productId: product.title.substring(0, 20) });
    }
    
    return product;
  } catch (error) {
    console.error('Error scraping product:', error);
    return null;
  }
}

// Helper functions
function detectLanguage() {
  const htmlLang = document.documentElement.lang;
  if (htmlLang && SELECTOR_MAP[htmlLang]) return htmlLang;
  
  // Fallback detection based on content
  if (document.querySelector('.tajuk-produk')) return 'my';
  if (document.querySelector('.judul-produk')) return 'id';
  return 'en';
}

function getElementText(selector) {
  const element = document.querySelector(selector);
  return element ? element.textContent.trim() : null;
}

function getElementTextFallback(selectors) {
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) return element.textContent.trim();
  }
  return null;
}

function getVariants(selector) {
  const variants = [];
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    variants.push(el.textContent.trim());
  });
  return variants.length ? variants : null;
}

function getVariantsFallback(selectors) {
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length) {
      const variants = [];
      elements.forEach(el => variants.push(el.textContent.trim()));
      return variants;
    }
  }
  return null;
}

function getImages(selector) {
  const images = [];
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    if (el.src) images.push(el.src);
  });
  return images.length ? images : null;
}

function getImagesFallback(selectors) {
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length) {
      const images = [];
      elements.forEach(el => {
        if (el.src) images.push(el.src);
      });
      return images.length ? images : null;
    }
  }
  return null;
}

function getVideos(selector) {
  const videos = [];
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    if (el.src) videos.push(el.src);
  });
  return videos.length ? videos : null;
}

function getVideosFallback(selectors) {
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length) {
      const videos = [];
      elements.forEach(el => {
        if (el.src) videos.push(el.src);
      });
      return videos.length ? videos : null;
    }
  }
  return null;
}

function getCategories(selector) {
  const categories = [];
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    categories.push(el.textContent.trim());
  });
  return categories.length ? categories : null;
}

function getCategoriesFallback(selectors) {
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length) {
      const categories = [];
      elements.forEach(el => {
        categories.push(el.textContent.trim());
      });
      return categories.length ? categories : null;
    }
  }
  return null;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { scrapeShopeeProduct };
} else {
  window.scrapeShopeeProduct = scrapeShopeeProduct;
}