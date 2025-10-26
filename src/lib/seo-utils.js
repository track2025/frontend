// SEO Utility Functions for Lap Snaps

/**
 * Generate structured data for race track events
 */
export function generateEventStructuredData(product) {
  if (!product) return null

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${product.location} Race Track Event - ${product.name}`,
    description: product.description || `High-quality race photography from ${product.location}`,
    startDate: product.dateCaptured,
    location: {
      "@type": "Place",
      name: product.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: product.location,
      },
    },
    image: product.cover?.url || product.images?.[0]?.url,
    organizer: {
      "@type": "Organization",
      name: "Lap Snaps",
      url: "https://lapsnaps.com",
    },
  }
}

/**
 * Generate structured data for products (photos)
 */
export function generateProductStructuredData(product) {
  if (!product) return null

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `Professional race track photography from ${product.location}`,
    image: product.cover?.url || product.images?.[0]?.url,
    brand: {
      "@type": "Brand",
      name: product.brand || "Lap Snaps",
    },
    offers: {
      "@type": "Offer",
      price: product.priceSale || product.price,
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
      url: `https://lapsnaps.com/product/${product.slug}`,
    },
    aggregateRating: product.totalRating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.totalRating,
          reviewCount: product.totalReviews || 0,
        }
      : undefined,
  }
}

/**
 * Generate structured data for race track locations
 */
export function generateLocationStructuredData(location, products = []) {
  if (!location) return null

  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: `${location} Race Track`,
    description: `Professional photography and videos from ${location} race track events`,
    url: `https://lapsnaps.com/race-track/${location.toLowerCase().replace(/\s+/g, "-")}`,
    image: products[0]?.cover?.url || products[0]?.images?.[0]?.url,
    hasMap: `https://www.google.com/maps/search/${encodeURIComponent(location + " race track")}`,
  }
}

/**
 * Generate organization structured data
 */
export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lap Snaps",
    description: "Your Gateway to Seamless Car Race Photos and Videos",
    url: "https://lapsnaps.com",
    logo: "https://lapsnaps.com/opengraph-image.png",
    sameAs: [
      // Add social media profiles here when available
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: "English",
    },
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ? `https://lapsnaps.com${item.url}` : undefined,
    })),
  }
}

/**
 * Generate image object structured data
 */
export function generateImageObjectStructuredData(product) {
  if (!product) return null

  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: product.cover?.url || product.images?.[0]?.url,
    name: product.name,
    description: product.description || `Race track photography from ${product.location}`,
    creator: {
      "@type": "Person",
      name: product.shop?.name || "Lap Snaps Photographer",
    },
    copyrightNotice: "© Lap Snaps",
    creditText: product.shop?.name || "Lap Snaps",
    datePublished: product.createdAt,
    keywords: `${product.location}, race track, motorsport photography, ${product.brand || ""}, ${product.name}`,
  }
}

/**
 * Popular race tracks for SEO targeting
 */
export const POPULAR_RACE_TRACKS = [
  "Silverstone",
  "Monaco",
  "Spa-Francorchamps",
  "Monza",
  "Suzuka",
  "Circuit of the Americas",
  "Nürburgring",
  "Brands Hatch",
  "Donington Park",
  "Oulton Park",
  "Snetterton",
  "Thruxton",
  "Cadwell Park",
  "Knockhill",
  "Croft",
  "Laguna Seca",
  "Watkins Glen",
  "Road America",
  "Sebring",
  "Daytona",
  "Indianapolis Motor Speedway",
  "Le Mans",
  "Imola",
  "Zandvoort",
  "Red Bull Ring",
  "Hungaroring",
  "Circuit de Barcelona-Catalunya",
  "Paul Ricard",
  "Mugello",
  "Portimao",
  "Yas Marina",
  "Bahrain International Circuit",
  "Sepang",
  "Shanghai International Circuit",
  "Mount Panorama",
  "Philip Island",
]

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path) {
  const baseUrl = "https://lapsnaps.com"
  return `${baseUrl}${path}`
}

/**
 * Generate optimized title for race tracks
 */
export function generateRaceTrackTitle(trackName) {
  return `${trackName} Race Track Photos & Videos | Professional Motorsport Photography | Lap Snaps`
}

/**
 * Generate optimized description for race tracks
 */
export function generateRaceTrackDescription(trackName) {
  return `Browse stunning professional photos and videos from ${trackName} race track events. High-quality motorsport photography capturing every moment. Download your race day memories today.`
}

/**
 * Generate keywords for race tracks
 */
export function generateRaceTrackKeywords(trackName) {
  return `${trackName}, ${trackName} race track, ${trackName} photos, ${trackName} racing, motorsport photography, race track events, car racing photos, ${trackName} circuit, track day photos, racing photography`
}
