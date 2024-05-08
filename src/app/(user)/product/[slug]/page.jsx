import React from 'react';
import { Suspense } from 'react';
// mui
import { Box, Container, Card, Grid } from '@mui/material';
//  Next
import { notFound } from 'next/navigation';
// components
import RelatedProductsCarousel from 'src/components/_main/product/relatedProducts';
import ProductDetailTabs from 'src/components/_main/product/tabs';
import ProductAdditionalInfo from 'src/components/_main/product/additionalInfo';
import ProductDetailsCarousel from 'src/components/carousels/details';
import ProductDetailsSumary from 'src/components/_main/product/summary';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
export async function generateStaticParams() {
  const { data } = await fetch(process.env.BASE_URL + '/api/products-slugs').then((res) => res.json());
  return data?.map((product) => ({
    slug: product.slug
  }));
}

export async function generateMetadata({ params }) {
  const { data: response } = await fetch(process.env.BASE_URL + '/api/products/' + params.slug).then((res) =>
    res.json()
  );

  return {
    title: response.metaTitle,
    description: response.metaDescription,
    keywords: response.tags,
    title: response.name,
    openGraph: {
      images: response.images.map((v) => v.url)
    }
  };
}

export default async function ProductDetail({ params: { slug } }) {
  const response = await fetch(process.env.BASE_URL + '/api/products/' + slug, { cache: 'no-store' }).then((res) =>
    res.json()
  );
  if (!response) {
    notFound();
  }
  const { data, totalRating, totalReviews, brand, category } = response;

  return (
    <Box>
      <Container fixed>
        <HeaderBreadcrumbs
          heading="Product Details"
          links={[
            {
              name: 'Home',
              href: '/'
            },
            {
              name: 'Product',
              href: '/products'
            },
            {
              name: data?.name
            }
          ]}
        />
        <Box mt={4}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <ProductDetailsCarousel slug={slug} product={data} data={data} />
            </Grid>
            <Grid item xs={12} md={8} lg={8}>
              <ProductDetailsSumary
                id={data?._id}
                product={data}
                brand={brand}
                category={category}
                totalRating={totalRating}
                totalReviews={totalReviews}
              />
            </Grid>
          </Grid>
          <Suspense fallback={<></>}>
            <ProductDetailTabs
              product={{ description: data.description, _id: data._id }}
              totalRating={totalRating}
              totalReviews={totalReviews}
            />
          </Suspense>
          <ProductAdditionalInfo />
          <Suspense fallback={<></>}>
            <RelatedProductsCarousel id={data._id} category={category?.slug} />
          </Suspense>
        </Box>
      </Container>
    </Box>
  );
}
