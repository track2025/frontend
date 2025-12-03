// mui
import { Box, Container } from '@mui/material';

// components
import MegaMenuClient from 'src/components/_main/track-products/MegaMenuClient';

const baseUrl = process.env.BASE_URL;

export const metadata = {
  title: 'Motorsport Merchandise & Race Wear | Lap Snaps',
  description:
    'Shop high-quality motorsport merchandise, race wear, and track day gear. Browse apparel, accessories, and equipment for racing enthusiasts.',
  keywords:
    'motorsport merchandise, race wear, track day gear, racing apparel, motorsport accessories, racing equipment, car enthusiast gear',
  openGraph: {
    title: 'Motorsport Merchandise & Race Wear | Lap Snaps',
    description: 'Shop high-quality motorsport merchandise, race wear, and track day gear',
    url: 'https://lapsnaps.com/track-products',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Motorsport Merchandise & Race Wear | Lap Snaps',
    description: 'Shop high-quality motorsport merchandise, race wear, and track day gear'
  },
  alternates: {
    canonical: 'https://lapsnaps.com/track-products'
  }
};

export default async function Listing() {
  const filtersRes = await fetch(`${baseUrl}/api/user/physical-products/filters`, { next: { revalidate: 60 } });
  const filtersData = await filtersRes.json();
  const filters = filtersData.data;

  const cateRes = await fetch(`${baseUrl}/api/physical-categories`, { next: { revalidate: 60 } });
  const categoriesData = await cateRes.json();
  const categories = categoriesData.data || categoriesData;

  console.log('categories::::', categories)

  // Fetch products for schema using the same API as the client component
  const productsRes = await fetch(`${baseUrl}/api/user/physical-products?limit=50`, { next: { revalidate: 60 } });
  const productsData = await productsRes.json();
  const products = productsData.data || [];

  // CollectionPage schema
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Track-Day Racing Gear & Motorsport Equipment',
    description: 'Premium helmets, racewear, pit gear, and accessories for track-day drivers and racers.',
    url: 'https://lapsnaps.com/track-products'
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://lapsnaps.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Track Products',
        item: 'https://lapsnaps.com/track-products'
      }
    ]
  };

  // Product schemas for each product
  const productStructuredData = products.map((product) => {
    // Determine availability based on stock
    const availability = product.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';

    // Use salePrice if available, otherwise use regular price
    const price = product.salePrice || product.price;

    // Extract brand from product name (first word before |)
    const brandMatch = product.name.match(/^([^|]+)\s*\|/);
    const brandName = brandMatch ? brandMatch[1].trim() : 'LapSnaps';

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: `High-quality ${product.name} - professional motorsport equipment and race wear.`,
      image: product.images?.[0]?.url,
      sku: product._id,
      mpn: product._id,
      brand: {
        '@type': 'Brand',
        name: brandName
      },
      offers: {
        '@type': 'Offer',
        price: price ? String(price) : '0',
        priceCurrency: 'GBP',
        availability: availability,
        url: `https://lapsnaps.com/track-products/${product.slug}`,
        seller: {
          '@type': 'Organization',
          name: 'LapSnaps'
        },
        ...(product.salePrice &&
          product.price &&
          product.salePrice < product.price && {
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: String(product.price),
              priceCurrency: 'GBP'
            }
          })
      },
      category: 'Motorsport Equipment'
    };
  });

  return (
    <>
      {/* CollectionPage Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Breadcrumb Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Product Schemas */}
      {productStructuredData.map((productSchema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      ))}

      <Box>
        <Box sx={{ bgcolor: 'background.default' }}>
          <MegaMenuClient categories={categories} filters={filters} />
        </Box>
      </Box>
    </>
  );
}
