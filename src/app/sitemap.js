// app/sitemap.js
import * as api from 'src/services';
import { getTracks } from 'src/services/tracks';
import { getBlogs } from 'src/services/blogs';
import { getSuperEvents } from 'src/services';

const BASE_URL = 'https://lapsnaps.com';

// Helper functions for product URL generation
const slugify = (text) => {
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
};

const formatDate = (dateStr) => {
  if (!dateStr) return '2025';
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const generateProductUrl = (product) => {
  const locationSlug = slugify(product.location);
  const dateSlug = formatDate(product.dateCaptured);
  return `/event/${locationSlug}/${dateSlug}/pictures/${product.slug}`;
};

export default async function sitemap() {
  // Fetch all data concurrently
  const [tracksData, photographersData, productsData, physicalProductsData, eventsData, blogsData] = await Promise.all([
    getTracks({ limit: 1000, page: 1 }), // Get all tracks
    api.getShops(), // Photographers
    api.getProducts(), // Digital products (photos)
    api.getUserPhysicalProducts('?limit=1000'), // Physical products
    getSuperEvents(), // Events
    getBlogs({ limit: 1000, page: 1 }) // Blog posts
  ]);

  // Extract data from responses
  const tracks = tracksData?.success ? tracksData.data : [];
  const photographers = photographersData?.data || [];
  const products = Array.isArray(productsData) ? productsData : productsData?.data || [];
  const physicalProducts = physicalProductsData?.data || [];
  const events = eventsData || [];
  const blogs = blogsData?.success ? blogsData.data : [];

  // Get unique countries from events for country pages
  const countriesMap = {};
  events.forEach((event) => {
    if (event.countrySlug && !countriesMap[event.countrySlug]) {
      countriesMap[event.countrySlug] = {
        slug: event.countrySlug,
        name: event.country,
        updatedAt: event.updatedAt || new Date()
      };
    }
  });
  const countries = Object.values(countriesMap);

  return [
    // Static pages
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7
    },
    {
      url: `${BASE_URL}/race-track/collection`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      url: `${BASE_URL}/photographers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${BASE_URL}/tracks`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    },
    {
      url: `${BASE_URL}/track-products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${BASE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    },

    // Dynamic tracks
    ...tracks.map((track) => ({
      url: `${BASE_URL}/tracks/${track.slug}`,
      lastModified: track.updatedAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    })),

    // Dynamic photographers
    ...photographers.map((photographer) => ({
      url: `${BASE_URL}/photographers/${photographer.slug}`,
      lastModified: photographer.updatedAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.8
    })),

    // Dynamic products (digital photos) - CORRECT URL FORMAT
    ...products.map((product) => ({
      url: `${BASE_URL}${generateProductUrl(product)}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.5
    })),

    // Dynamic physical products
    ...physicalProducts.map((product) => ({
      url: `${BASE_URL}/track-products/${product.slug}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.5
    })),

    // Event country pages only (not individual events)
    ...countries.map((country) => ({
      url: `${BASE_URL}/events/${country.slug}`,
      lastModified: country.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.6
    })),

    // Dynamic blog posts
    ...blogs.map((blog) => ({
      url: `${BASE_URL}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt || blog.publishedDate || new Date(),
      changeFrequency: 'daily',
      priority: 0.5
    }))
  ];
}
