// // mui
// import { Box, Container } from "@mui/material"

// // components
// import ShopDetailCover from "src/components/_admin/shops/shopDetailCover"
// import ProductList from "src/components/_main/products"

// // api
// import * as api from "src/services"

// export const revalidate = 10
// export const dynamic = "force-dynamic"
// export async function generateStaticParams() {
//   const { data } = await api.getShopSlugs()
//   const mapped = data?.map((shop) => {
//     return {
//       shop: shop.slug,
//     }
//   })
//   return mapped
// }

// export async function generateMetadata({ params }) {
//   const { data: response } = await api.getShopBySlug(params.shop)

//   return {
//     title: `${response?.title || "Photographer"} - Professional Motorsport Photography | Lap Snaps`,
//     description:
//       response?.description ||
//       `Browse stunning motorsport photography by ${response?.title}. High-quality race track and vehicle photos.`,
//     keywords: `${response?.title}, motorsport photographer, race track photography, vehicle photos, ${response?.location || ""}`,
//     openGraph: {
//       title: `${response?.title} - Professional Motorsport Photography`,
//       description: response?.description,
//       images: [response?.logo?.url || response?.cover?.url],
//       url: `https://lapsnaps.com/photographers/${params.shop}`,
//       type: "profile",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: `${response?.title} - Professional Motorsport Photography`,
//       description: response?.description,
//       images: [response?.logo?.url || response?.cover?.url],
//     },
//     alternates: {
//       canonical: `https://lapsnaps.com/photographers/${params.shop}`,
//     },
//   }
// }
// export default async function Listing({ params }) {
//   const { shop } = params
//   const { data: shopData } = await api.getShopTitle(shop)

//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "Person",
//     name: shopData?.title || shopData?.name,
//     description: shopData?.description,
//     image: shopData?.logo?.url || shopData?.cover?.url,
//     url: `https://lapsnaps.com/photographers/${shop}`,
//     jobTitle: "Motorsport Photographer",
//     worksFor: {
//       "@type": "Organization",
//       name: "Lap Snaps",
//     },
//   }

//   return (
//     <>
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

//       <Box>
//         <Box sx={{ bgcolor: "background.default" }}>
//           <Container maxWidth="xl">
//             <Box mt={3}>
//               <ShopDetailCover page="shops" isUser data={shopData} isLoading={false} />
//             </Box>

//             <ProductList shop={shopData} fetchFilters={"getFiltersByShop"} />
//           </Container>
//         </Box>
//       </Box>
//     </>
//   )
// }

// mui
import { Box, Container, Typography, Stack, Chip, Paper } from '@mui/material';
import { HiOutlineLocationMarker } from 'react-icons/hi';

// components
import ShopDetailCover from 'src/components/_admin/shops/shopDetailCover';
import ProductList from 'src/components/_main/products';

// api
import * as api from 'src/services';

export const revalidate = 10;
export const dynamic = 'force-dynamic';
export async function generateStaticParams() {
  const { data } = await api.getShopSlugs();
  const mapped = data?.map((shop) => {
    return {
      shop: shop.slug
    };
  });
  return mapped;
}

export async function generateMetadata({ params }) {
  const { data: response } = await api.getShopBySlug(params.shop);

  return {
    title: `${response?.title || 'Photographer'} - Professional Motorsport Photography | Lap Snaps`,
    description:
      response?.description ||
      `Browse stunning motorsport photography by ${response?.title}. High-quality race track and vehicle photos.`,
    keywords: `${response?.title}, motorsport photographer, race track photography, vehicle photos, ${response?.location || ''}`,
    openGraph: {
      title: `${response?.title} - Professional Motorsport Photography`,
      description: response?.description,
      images: [response?.logo?.url || response?.cover?.url],
      url: `https://lapsnaps.com/photographers/${params.shop}`,
      type: 'profile'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${response?.title} - Professional Motorsport Photography`,
      description: response?.description,
      images: [response?.logo?.url || response?.cover?.url]
    },
    alternates: {
      canonical: `https://lapsnaps.com/photographers/${params.shop}`
    }
  };
}

export default async function Listing({ params }) {
  const { shop } = params;
  const { data: shopData } = await api.getShopTitle(shop);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: shopData?.title || shopData?.name,
    description: shopData?.description,
    image: shopData?.logo?.url || shopData?.cover?.url,
    url: `https://lapsnaps.com/photographers/${shop}`,
    jobTitle: 'Motorsport Photographer',
    worksFor: {
      '@type': 'Organization',
      name: 'Lap Snaps'
    },
    ...(shopData?.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: shopData.address.streetAddress,
        addressLocality: shopData.address.city,
        addressCountry: shopData.address.country
      }
    })
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Box>
        <Box sx={{ bgcolor: 'background.default' }}>
          <Container maxWidth="xl">
            <Box mt={3}>
              <ShopDetailCover page="shops" isUser data={shopData} isLoading={false} />
            </Box>

            {/* Full Width Location and Description Section */}
            <Paper
              elevation={0}
              sx={{
                py: 4,
                px: 2,
                bgcolor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider'
              }}
            >
              <Container maxWidth="xl">
                <Stack spacing={3} alignItems="center" textAlign="center">
                  {/* Location - Full Width Emphasis */}
                  {shopData?.address?.streetAddress && (
                    <Box sx={{ width: '100%' }}>
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                        <HiOutlineLocationMarker size={20} color="text.secondary" />
                        <Typography
                          variant="h2"
                          color="text.primary"
                          fontWeight="500"
                          sx={{ fontSize: { xs: '15px', md: '20px' } }}
                        >
                          {shopData.address.streetAddress}
                          {shopData.address.city && `, ${shopData.address.city}`}
                          {shopData.address.country && `, ${shopData.address.country}`}
                        </Typography>
                      </Stack>
                    </Box>
                  )}

                  {/* Description - Full Width */}
                  {shopData?.description && (
                    <Box sx={{ width: '100%', maxWidth: '1000px', mx: 'auto' }}>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.7,
                          fontSize: '1.1rem'
                        }}
                      >
                        {shopData.description}
                      </Typography>
                    </Box>
                  )}

                  {/* Specialties - Full Width */}
                  <Box sx={{ width: '100%' }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" useFlexGap>
                      <Chip label="Motorsport Photography" color="primary" variant="outlined" />
                      <Chip label="Track Day Photos" color="primary" variant="outlined" />
                      <Chip label="Race Events" color="primary" variant="outlined" />
                      <Chip label="Vehicle Photography" color="primary" variant="outlined" />
                      <Chip label="Professional Shots" color="primary" variant="outlined" />
                      <Chip label="Circuit Photography" color="primary" variant="outlined" />
                    </Stack>
                  </Box>
                </Stack>
              </Container>
            </Paper>

            <ProductList shop={shopData} fetchFilters={'getFiltersByShop'} />
          </Container>
        </Box>
      </Box>
    </>
  );
}
