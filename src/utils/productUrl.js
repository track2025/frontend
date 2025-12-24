// Helper function to generate pretty product URLs
// Format: /event/{location-slug}/{date}/pictures/{product-slug}

export function slugify(text) {
  if (!text) return 'race-track';
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function formatDate(dateStr) {
  if (!dateStr) return '2025';
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function generateProductUrl(product) {
  if (!product) return '/products';
  
  const locationSlug = slugify(product.location);
  const dateSlug = formatDate(product.dateCaptured);
  const productSlug = product.slug || product._id;
  
  return `/event/${locationSlug}/${dateSlug}/pictures/${productSlug}`;
}
