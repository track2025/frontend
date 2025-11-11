import React from "react"
import { Typography, Grid, Box, Stack, Container } from "@mui/material"
import CategoryCard from "src/components/cards/category"
import * as api from "src/services"

export const metadata = {
  title: "Browse Categories | Motorsport Photography Collection | Lap Snaps",
  description:
    "Explore motorsport photography categories. Browse vehicle photos organized by type, event, and racing category.",
  keywords:
    "motorsport categories, racing categories, vehicle types, motorsport photography categories, car racing categories, bike racing categories",
  openGraph: {
    title: "Browse Categories | Lap Snaps",
    description: "Explore motorsport photography organized by categories",
    url: "https://lapsnaps.com/categories",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Categories | Lap Snaps",
    description: "Explore motorsport photography organized by categories",
  },
  alternates: {
    canonical: "https://lapsnaps.com/categories",
  },
}

export const dynamic = "force-dynamic"

export default async function Categories() {
  const data = await api.getAllCategoriesByUser()
  const categories = data?.data || []

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Motorsport Photography Categories",
    description: "Explore motorsport photography categories and browse vehicle photos organized by type and event",
    url: "https://lapsnaps.com/categories",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categories.map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Thing",
          name: category.name,
          image: category.cover?.url,
          url: `https://lapsnaps.com/categories/${category.slug || category._id}`,
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
            mt: 5,
          }}
        >
          <Box>
            <Typography variant="h1" color="text.primary" textAlign="center">
              Categories
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Explore our diverse collection of motorsport photography organized by categories
            </Typography>
          </Box>
          <Box>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              {categories.map((inner) => (
                <React.Fragment key={inner._id || Math.random()}>
                  <Grid item lg={2} md={3} sm={4} xs={4}>
                    <CategoryCard category={inner} isLoading={false} />
                  </Grid>
                </React.Fragment>
              ))}
              {!categories.length && (
                <Typography variant="h3" color="error.main" textAlign="center">
                  Categories not found
                </Typography>
              )}
            </Grid>
          </Box>
        </Stack>
      </Container>
    </>
  )
}
