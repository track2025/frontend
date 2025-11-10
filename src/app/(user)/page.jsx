// "use client"
// import dynamic from "next/dynamic"
// import { Container, Typography } from "@mui/material"
// import WhyUs from "src/components/_main/home/whyUs"
// import TopBanners from "src/components/_main/home/topBanners"
// import Head from "next/head"
// import HeroCarousel from "src/components/_main/HeroCarousel"
// import { useProgressiveLoading } from "src/hooks/useProgressiveLoading"

// // Dynamic imports
// const Categories = dynamic(() => import("src/components/_main/home/categories"))
// const BestSellingProducs = dynamic(() => import("src/components/_main/home/bestSelling"))
// const Banner = dynamic(() => import("src/components/_main/home/banner"))
// const Brands = dynamic(() => import("src/components/_main/home/brands"))
// const TopCollection = dynamic(() => import("src/components/_main/home/top"))
// const Shops = dynamic(() => import("src/components/_main/home/shop"))
// const Testimonials = dynamic(() => import("src/components/_main/home/testimonials"))
// const FeaturedProducts = dynamic(() => import("src/components/_main/home/featured"))

// export default function IndexPage() {
//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "WebSite",
//     name: "Lap Snaps",
//     description: "High-Quality Vehicle Photography from Race Tracks and Motorsport Events Worldwide",
//     url: "https://lapsnaps.com",
//     potentialAction: {
//       "@type": "SearchAction",
//       target: {
//         "@type": "EntryPoint",
//         urlTemplate: "https://lapsnaps.com/search?q={search_term_string}",
//       },
//       "query-input": "required name=search_term_string",
//     },
//     publisher: {
//       "@type": "Organization",
//       name: "Lap Snaps",
//       logo: {
//         "@type": "ImageObject",
//         url: "https://lapsnaps.com/logo.png",
//       },
//     },
//   }

//   const { isLoading } = useProgressiveLoading(
//     ["hero"],
//     800
//   );

//   return (
//     <>
//       <Head>
//         <title>Lap Snaps | High-Quality Vehicle Photography from Race Tracks Worldwide</title>
//         <meta
//           name="description"
//           content="Discover professional motorsport photography from race tracks worldwide. Browse vehicle photos, track day images, and racing event galleries from top photographers."
//         />
//         <meta
//           name="keywords"
//           content="motorsport photography, race track photos, vehicle photography, track day images, racing events, car photography, motorsport images"
//         />
//         <link rel="canonical" href="https://lapsnaps.com" />
//         <meta property="og:title" content="Lap Snaps | High-Quality Vehicle Photography" />
//         <meta property="og:description" content="Professional motorsport photography from race tracks worldwide" />
//         <meta property="og:url" content="https://lapsnaps.com" />
//         <meta property="og:type" content="website" />
//         <meta property="og:image" content="https://lapsnaps.com/opengraph-image.png" />
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content="Lap Snaps | High-Quality Vehicle Photography" />
//         <meta name="twitter:description" content="Professional motorsport photography from race tracks worldwide" />
//         <meta name="twitter:image" content="https://lapsnaps.com/opengraph-image.png" />
//       </Head>
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

//       <div style={{ maxWidth: "100%", overflow: "hidden" }}>
//         <video
//           autoPlay
//           muted
//           loop
//           playsInline
//           aria-label="Lap Snaps motorsport photography showcase video"
//           style={{
//             width: "100%",
//             height: "500px",
//             objectFit: "cover",
//           }}
//         >
//           <source src="/images/lapsnaps.mp4" type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       </div>

//       <Typography
//         variant="h1"
//         component="h1"
//         sx={{
//           textAlign: "center",
//           fontSize: {
//             xs: "1rem",
//             sm: "1rem",
//             md: "1.5rem",
//           },
//           fontWeight: 600,
//           mt: 4,
//         }}
//       >
//         Welcome to Lap Snaps — High-Quality Vehicle Photography
//       </Typography>

//       <TopBanners />

//       <Container maxWidth="xl">
//         <WhyUs />
//       </Container>

//       <Container maxWidth="xl">
//         <FeaturedProducts />
//       </Container>

//       <div className="flex flex-col lg:flex-row gap-6 ">
//         <div className="w-full lg:w-2/3 xl:w-3/4">
//           <HeroCarousel loading={isLoading("hero")} />
//         </div>
//       </div>

//       <Container maxWidth="xl">
//         <TopCollection />
//         {/* <Categories /> */}

//         {/* <Shops /> */}
//       </Container>

//       {/* <Testimonials /> */}
//       <Banner />

//       <Container maxWidth="xl">
//         <Brands />
//       </Container>
//     </>
//   )
// }
import { Container, Typography } from '@mui/material';
import WhyUs from 'src/components/_main/home/whyUs';
import TopBanners from 'src/components/_main/home/topBanners';
import HeroCarousel from 'src/components/_main/HeroCarousel';
import Banner from 'src/components/_main/home/banner';
import Brands from 'src/components/_main/home/brands';
import TopCollection from 'src/components/_main/home/top';
import FeaturedProducts from 'src/components/_main/home/featured';

// API functions
import * as api from 'src/services';

// Helper functions for intelligent product naming
function generateProductName(product) {
  if (product?.name) return product.name;

  const parts = [];
  if (product?.vehicle_make) parts.push(product.vehicle_make);
  if (product?.vehicle_model) parts.push(product.vehicle_model);
  if (product?.location) parts.push(`at ${product.location}`);

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
  }
};

export default async function IndexPage() {
  const homeData = await getHomeData();

  // Generate structured data with actual product and brand information
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
    // Add product information for SEO
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
            image: product.images?.[0]?.url || product.orignalImage?.[0]?.url || '',
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
    // Add brand/track information for SEO
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

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
        {/* Pass server-fetched data to FeaturedProducts */}
        <FeaturedProducts initialData={homeData.featuredProducts} />
      </Container>

      <div className="flex flex-col lg:flex-row gap-6 ">
        <div className="w-full lg:w-2/3 xl:w-3/4">
          <HeroCarousel />
        </div>
      </div>

      <Container maxWidth="xl">
        <TopCollection />
      </Container>

      <Banner />

      <Container maxWidth="xl">
        {/* Pass server-fetched data to Brands */}
        <Brands initialData={homeData.brands} />
      </Container>
    </>
  );
}
