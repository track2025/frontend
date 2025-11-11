// mui
import { Box, Container } from "@mui/material"

// components
import MegaMenuClient from "src/components/_main/track-products/MegaMenuClient"

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
  const filtersRes = await fetch(`${baseUrl}/api/user/physical-products/filters`, { next: { revalidate: 60 } });
  const filtersData = await filtersRes.json();
  const filters = filtersData.data;

  const cateRes = await fetch(`${baseUrl}/api/admin/all-physical-categories`, { next: { revalidate: 60 } });
  const categoriesData = await cateRes.json();
  const categories = categoriesData.data || categoriesData;


  console.log("Categories", categories);

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
          <MegaMenuClient categories={categories} filters={filters} />
        </Box>
      </Box>
    </>
  )
}
