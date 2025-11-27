import { Suspense } from 'react';

// mui
import { Box, Container, Stack, Grid } from '@mui/material';

// components
import RelatedProductsCarousel from 'src/components/_main/product/relatedProducts';
import ProductDetailsCarousel from 'src/components/carousels/customPaginationSilder';
import ProductDetailsSumary from 'src/components/_main/product/summary';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// api
import * as api from 'src/services';
import ProductDetailBanner from 'src/components/_main/banner/ProductDetailBanner';

export const revalidate = 10;
export const dynamic = 'force-dynamic';
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

  if (!response) {
    return {
      title: 'Product Not Found | Lap Snaps',
      description: 'The requested product could not be found.'
    };
  }

  // Helper: format date YYYY-MM-DD
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Helper: Title Case
  const toTitleCase = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const productName = response?.name || 'Vehicle Photo';
  const brandName = response?.shop?.name || response?.brand || 'Lap Snaps';
  const location = toTitleCase(response?.location);
  const dateCaptured = response?.dateCaptured ? formatDate(response.dateCaptured) : '';

  const title = `${location} Race Track Events on ${dateCaptured} - ${productName} – ${brandName}`;
  const description = `High-quality photo of ${productName} captured at ${location} on ${dateCaptured} by ${brandName}.`;
  const keywords = `${productName}, ${brandName}, ${location}, ${dateCaptured}, race track, vehicle photography`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: description,
    image: response?.images?.map((img) => img.url) || [],
    sku: response?._id,
    brand: {
      '@type': 'Brand',
      name: brandName
    },
    offers: {
      '@type': 'Offer',
      url: `https://lapsnaps.com/product/${params.slug}`,
      priceCurrency: 'USD',
      price: response?.price || 0,
      availability: response?.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: brandName
      }
    },
    aggregateRating: response?.totalRating
      ? {
          '@type': 'AggregateRating',
          ratingValue: response.totalRating,
          reviewCount: response.totalReviews || 0
        }
      : undefined
  };

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://lapsnaps.com/product/${params.slug}`,
      type: 'website',
      images: response?.images?.map((img) => img.url) || []
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: response?.images?.map((img) => img.url) || []
    },
    alternates: {
      canonical: `https://lapsnaps.com/product/${params.slug}`
    }
  };
}

export default async function ProductDetail({ params: { slug } }) {
  const response = await api.getProductDetails(slug);

  const { data, totalRating, totalReviews, brand, category, shopDetails, location, dateCaptured, name } = response;
  function formatShortDate(isoDate) {
    if (!isoDate) return '';

    const date = new Date(isoDate);

    const options = { day: 'numeric', month: 'short', year: 'numeric' };

    return date.toLocaleDateString('en-US', options);
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data?.name || 'Vehicle Photo',
    description: `High-quality photo captured at ${data?.location} on ${formatShortDate(data?.dateCaptured)}`,
    image: data?.images?.map((img) => img.url) || [],
    brand: {
      '@type': 'Brand',
      name: brand || shopDetails?.name || 'Lap Snaps'
    },
    offers: {
      '@type': 'Offer',
      url: `https://lapsnaps.com/product/${slug}`,
      priceCurrency: 'USD',
      price: data?.price || 0,
      availability: data?.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Box>
        <Container maxWidth="xl">
          <Stack gap={5}>
            <ProductDetailBanner
              heading={`${data?.location} Race Track Events on ${formatShortDate(data?.dateCaptured)}  ${data?.name || ''}`}
              breadcrumbs={[
                { href: '/', name: 'Home' },
                { href: '/race-track/collection', name: 'Products' },
                {
                  name: data?.name
                }
              ]}
            />

            <Grid container justifyContent="center" className="w-100 row ">
              <Grid item className="col-md-8 col-sm-12  ">
                <ProductDetailsCarousel slug={slug} product={data} data={data} />
              </Grid>
              <Grid item className="col-md-4 h-100  col-sm-12">
                <ProductDetailsSumary
                  className="h-100"
                  id={data?._id}
                  product={data}
                  brand={brand}
                  category={category}
                  totalRating={totalRating}
                  totalReviews={totalReviews}
                  shopDetails={shopDetails}
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
    </>
  );
}
