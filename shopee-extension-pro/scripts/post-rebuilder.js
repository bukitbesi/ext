// post-rebuilder.js - Converts scraped data to various formats
class PostRebuilder {
  static async rebuildToJSON(product) {
    return JSON.stringify(product, null, 2);
  }

  static async rebuildToCSV(product) {
    const headers = ['Title', 'Price', 'Discount', 'Rating', 'Categories', 'Images', 'URL'];
    const values = [
      `"${product.title || ''}"`,
      `"${product.price || ''}"`,
      `"${product.discount || ''}"`,
      `"${product.rating || ''}"`,
      `"${(product.categories || []).join('; ')}"`,
      `"${(product.images || []).join('; ')}"`,
      `"${product.url || ''}"`
    ];
    
    return `${headers.join(',')}\n${values.join(',')}`;
  }

  static async rebuildToHTML(product) {
    return `
      <div class="product-card">
        <h2>${product.title || 'Product Title'}</h2>
        <p>Price: ${product.price || 'N/A'}</p>
        <p>Discount: ${product.discount || 'N/A'}</p>
        <p>Rating: ${product.rating || 'N/A'}</p>
        <div class="images">
          ${(product.images || []).map(img => `<img src="${img}" alt="Product Image">`).join('')}
        </div>
        <p>Categories: ${(product.categories || []).join(', ')}</p>
        <a href="${product.url || '#'}">View on Shopee</a>
      </div>
    `;
  }

  static async rebuildToWhatsApp(product) {
    const images = product.images || [];
    const firstImage = images.length > 0 ? images[0] : '';
    
    return JSON.stringify({
      name: product.title || 'Product',
      price: product.price || 'N/A',
      image: firstImage,
      url: product.url || ''
    });
  }

  static async rebuildToShopifyCSV(product) {
    const headers = [
      'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published', 
      'Option1 Name', 'Option1 Value', 'Variant Price', 'Image Src'
    ];
    
    const values = [
      `"${product.title || ''}"`,
      `"${this.generateDescription(product) || ''}"`,
      `"ShopeeExtensionPro"`,
      `"${(product.categories || [''])[0] || ''}"`,
      `"${(product.categories || []).join(', ')}"`,
      `"TRUE"`,
      `"Title"`,
      `"${product.title || ''}"`,
      `"${this.extractPriceValue(product.price) || ''}"`,
      `"${(product.images || [''])[0] || ''}"`
    ];
    
    return `${headers.join(',')}\n${values.join(',')}`;
  }

  static generateDescription(product) {
    return `
      <p>${product.title || 'Product'}</p>
      <p>Price: ${product.price || 'N/A'}</p>
      <p>Rating: ${product.rating || 'N/A'}</p>
      <p>Categories: ${(product.categories || []).join(', ')}</p>
    `;
  }

  static extractPriceValue(priceText) {
    if (!priceText) return '';
    const match = priceText.match(/[\d,]+\.?\d*/);
    return match ? match[0].replace(/,/g, '') : '';
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PostRebuilder;
} else {
  window.PostRebuilder = PostRebuilder;
}