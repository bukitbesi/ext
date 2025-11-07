// selector-map.js - DOM abstraction for Shopee pages
const SELECTOR_MAP = {
  en: {
    title: '.product-title',
    price: '.product-price',
    discount: '.discount-price',
    variants: '.product-variants',
    images: '.product-images img',
    videos: '.product-videos video',
    rating: '.seller-rating',
    categories: '.breadcrumb a'
  },
  my: {
    title: '.tajuk-produk',
    price: '.harga-produk',
    discount: '.harga-diskaun',
    variants: '.varian-produk',
    images: '.imej-produk img',
    videos: '.video-produk video',
    rating: '.penarafan-penjual',
    categories: '.lencana a'
  },
  id: {
    title: '.judul-produk',
    price: '.harga-produk',
    discount: '.harga-diskon',
    variants: '.varian-produk',
    images: '.gambar-produk img',
    videos: '.video-produk video',
    rating: '.rating-penjual',
    categories: '.breadcrumb a'
  }
};

// Fallback selectors for when layout changes
const FALLBACK_SELECTORS = {
  title: ['h1', '[data-testid="product-title"]', '.product-title'],
  price: ['.price', '[data-testid="product-price"]', '.product-price'],
  discount: ['.discount', '.special-price', '.sale-price'],
  variants: ['.variants', '.sku-selector', '.product-variants'],
  images: ['img', '.product-image', '.main-image'],
  videos: ['video', '.product-video'],
  rating: ['.rating', '.seller-rating', '.product-rating'],
  categories: ['.breadcrumb a', '.category-path a', '.nav-breadcrumb a']
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SELECTOR_MAP, FALLBACK_SELECTORS };
} else {
  window.SELECTOR_MAP = SELECTOR_MAP;
  window.FALLBACK_SELECTORS = FALLBACK_SELECTORS;
}