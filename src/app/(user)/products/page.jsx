// mui
import { Box, Container } from '@mui/material';
import ProductList from 'src/components/_main/products';
import CollectionBanner from 'src/components/_main/banner/CollectionBanner';
import { getProducts } from 'src/services';
export const dynamic = "force-dynamic"


export const dynamic = "force-dynamic"

// ✅ Dynamic SEO generator
export async function generateMetadata() {
  const title = 'Motorsport Photography & Race Track Vehicle Photos | Lap Snaps';
  const description =
    'Browse high-quality vehicle photography from race tracks and motorsport events around the world. Professional track day and racing event photos.';
  const canonical = 'https://lapsnaps.com/products';
  const image = 'https://lapsnaps.com/opengraph-image.png';

  return {
    title,
    description,
    keywords: 'motorsport photography, race track photos, vehicle photography, track day images, racing event photos',
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [{ url: image }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  };
}

// Helper functions from your ShopProductCard
const slugify = (text) => {
  if (!text) return 'race-track';
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
};

// Format date to YYYY-MM-DD
const formatDate = (dateStr) => {
  if (!dateStr) return '2025';
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Generate product detail URL
const generateProductUrl = (product) => {
  const locationSlug = slugify(product.location);
  const dateSlug = formatDate(product.dateCaptured);
  return `/event/${locationSlug}/${dateSlug}/pictures/${product.slug}`;
};

// ✅ Server Component (renders HTML + SEO)
export default async function Listing() {
  // Fetch products from API route
  const productsData = await getProducts();
  // console.log('==========>>>> productsData', productsData);

  // Handle case where productsData might be an object with data property
  const products = Array.isArray(productsData) ? productsData : productsData?.data || [];

  // Generate breadcrumbs data
  const breadcrumbs = [
    { href: '/', name: 'Home' },
    { href: '/race-track/collection', name: 'All Photos' }
  ];

  // Main structured data for the collection page with products
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Motorsport Photography Collection',
    description: 'Professional motorsport photography from race tracks worldwide',
    url: 'https://lapsnaps.com/race-track/collection',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => {
        // Format date for description
        const formattedDate = product.dateCaptured
          ? new Date(product.dateCaptured).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : 'recently';

        // Generate the correct product URL
        const productUrl = `https://lapsnaps.com${generateProductUrl(product)}`;

        return {
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            '@id': productUrl,
            name: product.name || `${product.location} Motorsport Photos`,
            description: `Professional motorsport photography from ${product.location} captured on ${formattedDate}. High-quality race track photos available for purchase.`,
            image: product.image?.url || '',
            sku: product._id,
            brand: {
              '@type': 'Brand',
              name: product.photographer?.name || 'LapSnaps'
            },
            offers: {
              '@type': 'Offer',
              price: product.priceSale,
              priceCurrency: product.currency,
              availability: 'https://schema.org/InStock',
              url: productUrl
            },
            category: product.category || 'Motorsport Photography',
            locationCreated: product.location
              ? {
                  '@type': 'Place',
                  name: product.location
                }
              : undefined,
            dateCreated: product.dateCaptured,
            productionDate: product.dateCaptured
          }
        };
      })
    }
  };

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://lapsnaps.com${item.href}`
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      <Box>
        <Box sx={{ bgcolor: 'background.default' }}>
          <Container maxWidth="xl">
            {/* Pass breadcrumbs to the banner */}
            <CollectionBanner breadcrumbs={breadcrumbs} />
            {/* Pass products data to ProductList */}
            <ProductList initialProducts={products} />
          </Container>
        </Box>
      </Box>
    </>
  );
}
