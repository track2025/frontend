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

  const cateRes = await fetch(`${baseUrl}/api/admin/all-physical-categories`, { next: { revalidate: 60 } });
  const categoriesData = await cateRes.json();
  const categories = categoriesData.data || categoriesData;

  // Products fetching (if needed)
  let productsRes = await fetch(`${baseUrl}/api/user/physical-products`, { next: { revalidate: 60 } });
  let products = await productsRes.json();
  products = products.data || products;

  let breadcrumb = categories;

  // const structuredData = {
  //   "@context": "https://schema.org",
  //   "@type": "CollectionPage",
  //   name: "Motorsport Merchandise & Race Wear",
  //   description: "Shop high-quality motorsport merchandise, race wear, and track day gear",
  //   url: "https://lapsnaps.com/track-products",
  // }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      // -------------------------
      // COLLECTION PAGE SCHEMA
      // -------------------------
      {
        '@type': 'CollectionPage',
        name: 'Motorsport Merchandise & Race Wear',
        description: 'Shop high-quality motorsport merchandise, race wear, and track day gear',
        url: 'https://lapsnaps.com/track-products'
      },

      // -------------------------
      // PRODUCT LIST SCHEMA
      // -------------------------
      ...products.map((item) => ({
        '@type': 'Product',
        '@id': `https://lapsnaps.com/track-product/${item.slug}`,
        name: item.name,
        image: item.images?.[0]?.url || '',
        sku: item._id,
        url: `https://lapsnaps.com/track-product/${item.slug}`,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: item.averageRating || 0,
          reviewCount: 0
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: item.salePrice ?? item.price ?? '0',
          availability: item.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: `https://lapsnaps.com/products/${item.slug}`
        }
      })),

      // -------------------------
      // BREADCRUMB LIST SCHEMA
      // -------------------------
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumb.map((b, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: b.name,
          item: `https://lapsnaps.com/${b.slug ? `track-products?category=${b.slug}` : 'track-products'}`
        }))
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Box>
        <Box sx={{ bgcolor: 'background.default' }}>
          <MegaMenuClient categories={categories} filters={filters} />
        </Box>
      </Box>
    </>
  );
}
