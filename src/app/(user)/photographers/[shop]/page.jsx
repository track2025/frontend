// mui
import { Box, Container } from "@mui/material"

// components
import ShopDetailCover from "src/components/_admin/shops/shopDetailCover"
import ProductList from "src/components/_main/products"

// api
import * as api from "src/services"

export const revalidate = 10
export const dynamic = "force-dynamic"
export async function generateStaticParams() {
  const { data } = await api.getShopSlugs()
  const mapped = data?.map((shop) => {
    return {
      shop: shop.slug,
    }
  })
  return mapped
}

export async function generateMetadata({ params }) {
  const { data: response } = await api.getShopBySlug(params.shop)

  return {
    title: `${response?.title || "Photographer"} - Professional Motorsport Photography | Lap Snaps`,
    description:
      response?.description ||
      `Browse stunning motorsport photography by ${response?.title}. High-quality race track and vehicle photos.`,
    keywords: `${response?.title}, motorsport photographer, race track photography, vehicle photos, ${response?.location || ""}`,
    openGraph: {
      title: `${response?.title} - Professional Motorsport Photography`,
      description: response?.description,
      images: [response?.logo?.url || response?.cover?.url],
      url: `https://lapsnaps.com/photographers/${params.shop}`,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${response?.title} - Professional Motorsport Photography`,
      description: response?.description,
      images: [response?.logo?.url || response?.cover?.url],
    },
    alternates: {
      canonical: `https://lapsnaps.com/photographers/${params.shop}`,
    },
  }
}
export default async function Listing({ params }) {
  const { shop } = params
  const { data: shopData } = await api.getShopTitle(shop)

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: shopData?.title || shopData?.name,
    description: shopData?.description,
    image: shopData?.logo?.url || shopData?.cover?.url,
    url: `https://lapsnaps.com/photographers/${shop}`,
    jobTitle: "Motorsport Photographer",
    worksFor: {
      "@type": "Organization",
      name: "Lap Snaps",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Box>
        <Box sx={{ bgcolor: "background.default" }}>
          <Container maxWidth="xl">
            <Box mt={3}>
              <ShopDetailCover page="shops" isUser data={shopData} isLoading={false} />
            </Box>

            <ProductList shop={shopData} fetchFilters={"getFiltersByShop"} />
          </Container>
        </Box>
      </Box>
    </>
  )
}
