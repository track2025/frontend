// mui
import { Box, Container } from "@mui/material"

// components
import HeaderBreadcrumbs from "src/components/headerBreadcrumbs"
import ProductList from "src/components/_main/track-products"
import FilterChips from "src/components/_main/track-products/search-params-list"

const baseUrl = process.env.BASE_URL

export const metadata = {
  title: "Motorsport Merchandise & Race Wear | Lap Snaps",
  description:
    "Shop high-quality motorsport merchandise, race wear, and track day gear. Browse apparel, accessories, and equipment for racing enthusiasts.",
  keywords:
    "motorsport merchandise, race wear, track day gear, racing apparel, motorsport accessories, racing equipment, car enthusiast gear",
  openGraph: {
    title: "Motorsport Merchandise & Race Wear | Lap Snaps",
    description: "Shop high-quality motorsport merchandise, race wear, and track day gear",
    url: "https://lapsnaps.com/track-products",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Motorsport Merchandise & Race Wear | Lap Snaps",
    description: "Shop high-quality motorsport merchandise, race wear, and track day gear",
  },
  alternates: {
    canonical: "https://lapsnaps.com/track-products",
  },
}

export default async function Listing() {
  const res = await fetch(`${baseUrl}/api/user/physical-products/filters`, {
    next: { revalidate: 60 },
  })

  const response = await res.json()

  const { data: filters } = response

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Motorsport Merchandise & Race Wear",
    description: "Shop high-quality motorsport merchandise, race wear, and track day gear",
    url: "https://lapsnaps.com/track-products",
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Box>
        <Box sx={{ bgcolor: "background.default" }}>
          <Container maxWidth="xl">
            <HeaderBreadcrumbs
              heading="Track Products"
              links={[
                {
                  name: "Home",
                  href: "/",
                },
                {
                  name: "Track Products",
                },
              ]}
            />
            <Box>
              <FilterChips />
            </Box>
            <ProductList filters={filters} />
          </Container>
        </Box>
      </Box>
    </>
  )
}
