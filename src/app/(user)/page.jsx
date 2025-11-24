import { Container, Typography } from '@mui/material';
import WhyUs from 'src/components/_main/home/whyUs';
import TopBanners from 'src/components/_main/home/topBanners';
import HeroCarousel from 'src/components/_main/HeroCarousel';
import Banner from 'src/components/_main/home/banner';
import BrandsServer from 'src/components/_main/home/brands/server';
import FeaturedProductsServer from 'src/components/_main/home/featured/server';
import TopCollection from 'src/components/_main/home/top';

// API functions
import * as api from 'src/services';
import { getTracks } from 'src/services/tracks';

// Helper functions for intelligent product naming
function generateProductName(product) {
  if (product?.name) return product.name;

  const parts = [];
  if (product?.vehicle_make) parts.push(product.vehicle_make);
  if (product?.vehicle_model) parts.push(product.vehicle_model);
  if (product?.location) parts.push(` ${product.location}`);

  if (parts.length > 0) return parts.join(' ');
  if (product?.location) return `Motorsport Photo from ${product.location}`;

  return 'Professional Motorsport Photography';
}

function generateProductDescription(product) {
  if (product?.description) return product.description;

  const parts = [];
  if (product?.vehicle_make) parts.push(product.vehicle_make);
  if (product?.vehicle_model) parts.push(product.vehicle_model);

  if (parts.length > 0 && product?.location) {
    return `High-quality ${parts.join(' ')} photography from ${product.location}`;
  }

  if (product?.location) {
    return `Professional vehicle photography from ${product.location}`;
  }

  return 'High-quality motorsport photography from professional trackside photographers';
}

async function getHomeData() {
  try {
    const [featuredProducts, brands] = await Promise.all([
      api.getFeaturedProducts().catch(() => ({ data: [] })),
      api.getHomeBrands().catch(() => ({ data: [] }))
    ]);

    return {
      featuredProducts: featuredProducts?.data || [],
      brands: brands?.data || []
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      featuredProducts: [],
      brands: []
    };
  }
}

export const metadata = {
  metadataBase: new URL('https://lapsnaps.com'),
  title: 'Lap Snaps | High-Quality Vehicle Photography from Race Tracks Worldwide',
  description:
    'Discover professional motorsport photography from race tracks worldwide. Browse vehicle photos, track day images, and racing event galleries from top photographers.',
  keywords:
    'motorsport photography, race track photos, vehicle photography, track day images, racing events, car photography, motorsport images',
  openGraph: {
    title: 'Lap Snaps | High-Quality Vehicle Photography',
    description: 'Professional motorsport photography from race tracks worldwide',
    url: 'https://lapsnaps.com',
    type: 'website',
    images: ['https://lapsnaps.com/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lap Snaps | High-Quality Vehicle Photography',
    description: 'Professional motorsport photography from race tracks worldwide',
    images: ['https://lapsnaps.com/opengraph-image.png']
  },
  alternates: {
    canonical: 'https://lapsnaps.com'
  }
};

export default async function IndexPage() {
  const homeData = await getHomeData();
  const response = await getTracks({
    limit: 100,
    page: 1,
    search: ''
  });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Lap Snaps',
    description: 'High-Quality Vehicle Photography from Race Tracks and Motorsport Events Worldwide',
    url: 'https://lapsnaps.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://lapsnaps.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lap Snaps',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lapsnaps.com/logo.png'
      }
    },
    ...(homeData.featuredProducts.length > 0 && {
      about: {
        '@type': 'ItemList',
        itemListElement: homeData.featuredProducts.slice(0, 10).map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: generateProductName(product),
            description: generateProductDescription(product),
            image: product.image?.url || '',
            url: `https://lapsnaps.com/products/${product.slug || product._id}`,
            ...(product.priceSale && {
              offers: {
                '@type': 'Offer',
                price: product.priceSale,
                priceCurrency: product.currency || 'GBP',
                availability: 'https://schema.org/InStock'
              }
            })
          }
        }))
      }
    }),
    ...(homeData.brands.length > 0 && {
      subjectOf: {
        '@type': 'ItemList',
        itemListElement: homeData.brands.slice(0, 10).map((brand, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Place',
            name: brand.name,
            description: `Race track photography from ${brand.name}`,
            image: brand.logo?.url || '',
            url: `https://lapsnaps.com/tracks/${brand.slug || brand._id}`
          }
        }))
      }
    })
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Lap Snaps',
    alternateName: 'LapSnaps',
    url: 'https://lapsnaps.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://lapsnaps.com/logo.png',
      width: 250,
      height: 60
    },
    description:
      'Professional motorsport and race track photography marketplace connecting photographers with motorsport enthusiasts worldwide',
    sameAs: ['https://www.facebook.com/lapsnaps', 'https://www.instagram.com/lapsnaps', 'https://twitter.com/lapsnaps'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@lapsnaps.com',
      availableLanguage: ['English']
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://lapsnaps.com'
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-label="Lap Snaps motorsport photography showcase video"
          style={{
            width: '100%',
            height: '500px',
            objectFit: 'cover'
          }}
        >
          <source src="/images/lapsnaps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <Typography
        variant="h1"
        component="h1"
        sx={{
          textAlign: 'center',
          fontSize: {
            xs: '1rem',
            sm: '1rem',
            md: '1.5rem'
          },
          fontWeight: 600,
          mt: 4
        }}
      >
        Welcome to Lap Snaps — High-Quality Vehicle Photography
      </Typography>

      <TopBanners />

      <Container maxWidth="xl">
        <WhyUs />
      </Container>

      <Container maxWidth="xl">
        <FeaturedProductsServer products={homeData.featuredProducts} />
      </Container>

      <HeroCarousel />

      <Container maxWidth="xl">
        <TopCollection />
      </Container>

      <Banner />

      <Container maxWidth="xl">
        <BrandsServer brands={response.data} />
      </Container>
    </>
  );
}
