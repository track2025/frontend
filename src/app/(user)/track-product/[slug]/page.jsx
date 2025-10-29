// app/products/[slug]/page.jsx or page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { Box, Container, Stack } from '@mui/material';

import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import PhysicalProductDetail from 'src/components/_main/track-product/physicalProductDetails';
import AdditionalPhysicalProductInfo from 'src/components/_main/track-product/additional-info';
import RelatedPhysicalProducts from 'src/components/_main/track-product/related-products';
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
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription,
    keywords: product.tags || [],
    openGraph: {
      title: product.name,
      description: product.metaDescription,
      images: images.map((v) => ({ url: v.url }))
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

  console.log("Physical Product:", response);

  if (!response?.success || !response?.data) {
    notFound(); // Show 404 page
  }

  const { data, totalRating, totalReviews, brand, category } = response;
  const isSimpleProduct = data?.type === 'simple';



  return (
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
  );
}
