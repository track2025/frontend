import React from 'react';
import { Suspense } from 'react';

// mui
import { Box, Container, Stack, Grid } from '@mui/material';

// components
import RelatedProductsCarousel from 'src/components/_main/product/relatedProducts';
import ProductDetailTabs from 'src/components/_main/product/tabs';
import ProductAdditionalInfo from 'src/components/_main/product/additionalInfo';
import ProductDetailsCarousel from 'src/components/carousels/customPaginationSilder';
import ProductDetailsSumary from 'src/components/_main/product/summary';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// api
import * as api from 'src/services';

export const revalidate = 10;
export const dynamic = 'error';

export async function generateStaticParams() {
  const { data } = await api.getProductSlugs();
  return data?.map((product) => {
    return {
      slug: product.slug
    };
  });
}

export async function generateMetadata({ params }) {
  const { data: response } = await api.getProductDetails(params.slug);

  return {
    title: response?.metaTitle,
    description: response?.metaDescription,
    keywords: response?.tags,
    title: response?.name,
    openGraph: {
      images: response?.images.map((v) => v.url)
    }
  };
}

export default async function ProductDetail({ params: { slug } }) {
  const response = await api.getProductDetails(slug);

  const { data, totalRating, totalReviews, brand, category } = response;

  return (
    <Box>
      <Container maxWidth="xl">
        <Stack gap={5}>
          <HeaderBreadcrumbs
            heading="Product Details"
            links={[
              {
                name: 'Home',
                href: '/'
              },
              {
                name: 'Products',
                href: '/products'
              },
              {
                name: data?.name
              }
            ]}
          />
          <Grid container  justifyContent="center" className="w-100 row ">
       

            <Grid item  className="col-md-8 col-sm-12 col-8 ">
              <ProductDetailsCarousel slug={slug} product={data} data={data} />
            </Grid>
            <Grid item className="col-md-4 h-100 col-4 col-sm-12">
              <ProductDetailsSumary className="h-100"
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
            {/* <ProductDetailTabs
              product={{ description: data.description, _id: data._id }}
              totalRating={totalRating}
              totalReviews={totalReviews}
            /> */}
          </Suspense>
          <Suspense fallback={<></>}>
            <RelatedProductsCarousel id={data._id} category={category?.slug} />
          </Suspense>
        </Stack>
      </Container>
    </Box>
  );
}
