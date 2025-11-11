import React from "react"
import { Typography, Grid, Box, Stack, Container } from "@mui/material"
import UserBrandsCard from "src/components/cards/brand"
import * as api from "src/services"

export const metadata = {
  title: "All Brands | Professional Motorsport Photography | Lap Snaps",
  description:
    "Browse all motorsport brands and manufacturers featured in our photography collection. Discover high-quality vehicle photos from top automotive brands.",
  keywords:
    "motorsport brands, car brands, vehicle manufacturers, automotive photography, race car brands, motorsport manufacturers",
  openGraph: {
    title: "All Brands | Lap Snaps",
    description: "Browse all motorsport brands featured in our photography collection",
    url: "https://lapsnaps.com/brands",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Brands | Lap Snaps",
    description: "Browse all motorsport brands featured in our photography collection",
  },
  alternates: {
    canonical: "https://lapsnaps.com/brands",
  },
}

export const dynamic = "force-dynamic"

export default async function BrandPage() {
  const data = await api.getBrands()
  const brands = data?.data || []

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Motorsport Brands Collection",
    description: "Browse all motorsport brands and manufacturers featured in our photography collection",
    url: "https://lapsnaps.com/brands",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: brands.map((brand, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Brand",
          name: brand.name,
          logo: brand.logo?.url,
          url: `https://lapsnaps.com/brands/${brand.slug || brand._id}`,
        },
      })),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Container maxWidth="xl">
        <Stack
          direction={"column"}
          sx={{
            gap: 3,
            my: 5,
          }}
        >
          <Box>
            <Typography variant="h1" color="text.primary" textAlign="center">
              All Brands
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Browse our collection of motorsport brands and manufacturers featured in professional photography
            </Typography>
          </Box>
          <Box>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              {brands.map((inner) => (
                <React.Fragment key={inner._id || Math.random()}>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <UserBrandsCard item={inner} isLoading={false} />
                  </Grid>
                </React.Fragment>
              ))}
              {!brands.length && (
                <Typography variant="h3" color="error.main" textAlign="center">
                  Brands not found
                </Typography>
              )}
            </Grid>
          </Box>
        </Stack>
      </Container>
    </>
  )
}
