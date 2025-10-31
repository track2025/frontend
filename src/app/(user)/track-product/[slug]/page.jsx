import { notFound } from 'next/navigation';
import { Box, Container, Stack } from '@mui/material';

import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import PhysicalProductDetail from 'src/components/_main/track-product/physicalProductDetails';
import AdditionalPhysicalProductInfo from 'src/components/_main/track-product/additional-info';
import PhysicalProductTabs from 'src/components/_main/track-product/tabs';
import PhysicalProductContentCard from 'src/components/cards/physicalProductContent';
// Static generation with ISR
export const revalidate = 60;

// ✅ Base URL (set once for all fetches)
const baseUrl = process.env.BASE_URL;

// ✅ Generate all static paths at build
export async function generateStaticParams() {
  const res = await fetch(`${baseUrl}/api/user/physical-products-slugs`, {
    next: { revalidate: 3600 } // Cache slug list for 1 hour
  });

  const { data } = await res.json();

  return (
    data?.map((product) => ({
      slug: product.slug
    })) || []
  );
}

// ✅ Generate metadata per product
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const res = await fetch(`${baseUrl}/api/user/physical-products/${slug}`, {
    cache: 'force-cache' // Prefer cached
  });

  const { data: product } = await res.json();

  if (!product) return {};

  const images = product.images || [];

  return {
    title: product.metaTitle || `${product.name} | Motorsport Merchandise | Lap Snaps`,
    description:
      product.metaDescription ||
      product.shortDescription ||
      `Shop ${product.name} - High-quality motorsport merchandise and race wear from Lap Snaps`,
    keywords: product.tags?.join(', ') || `${product.name}, motorsport merchandise, race wear, track day gear`,
    openGraph: {
      title: product.name,
      description: product.metaDescription || product.shortDescription,
      images: images.map((v) => ({ url: v.url })),
      url: `https://lapsnaps.com/track-product/${slug}`,
      type: 'article'
    },
    other: {
      'og:type': 'product'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.metaDescription || product.shortDescription,
      images: images.map((v) => v.url)
    },
    alternates: {
      canonical: `https://lapsnaps.com/track-product/${slug}`
    }
  };
}

// ✅ Main page component
export default async function ProductDetail({ params }) {
  const { slug } = await params;

  const res = await fetch(`${baseUrl}/api/user/physical-products/${slug}`, {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });

  const response = await res.json();

  if (!response?.success || !response?.data) {
    notFound(); // Show 404 page
  }

  const { data, totalRating, totalReviews, brand, category } = response;
  const isSimpleProduct = data?.type === 'simple';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.shortDescription || data.content,
    image: data.images?.map((img) => img.url) || [],
    brand: {
      '@type': 'Brand',
      name: brand?.name || 'Lap Snaps'
    },
    category: category?.name,
    offers: {
      '@type': 'Offer',
      url: `https://lapsnaps.com/track-product/${slug}`,
      priceCurrency: 'USD',
      price: data.price || 0,
      availability: data.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    },
    aggregateRating: totalRating
      ? {
          '@type': 'AggregateRating',
          ratingValue: totalRating,
          reviewCount: totalReviews || 0
        }
      : undefined
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Box>
        <Container maxWidth="xl">
          <Stack direction={'column'} gap={3}>
            <HeaderBreadcrumbs
              heading="Product Details"
              links={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/track-products' }, { name: data?.name }]}
            />

            <PhysicalProductDetail
              data={data}
              brand={brand}
              slug={slug}
              category={category}
              totalRating={totalRating}
              totalReviews={totalReviews}
              isSimpleProduct={isSimpleProduct}
            />
            <PhysicalProductContentCard content={data.content} name={data.name} />

            <PhysicalProductTabs
              product={{ description: data.content, _id: data._id }}
              totalRating={totalRating}
              totalReviews={totalReviews}
            />

            <AdditionalPhysicalProductInfo />

            {/* <RelatedPhysicalProducts id={data._id} category={category?.slug} /> */}
          </Stack>
        </Container>
      </Box>
    </>
  );
}
