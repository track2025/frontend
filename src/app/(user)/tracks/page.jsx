import { getTracks } from "src/services/tracks"
import TracksClientPage from "src/components/_main/track/TracksClientPage"
import TracksServerPage from "src/components/_main/track/TracksServerPage"

export const metadata = {
  title: "Car, Bike & Kart Race Tracks Worldwide | LapSnaps",
  description:
    "Explore car, bike & kart circuits from around the world. Browse iconic race tracks including Silverstone, Spa-Francorchamps, Nürburgring, Bedford Autodrome, Yas Marina, and more. Find track days and motorsport events.",
  keywords:
    "race tracks, motorsport circuits, car racing, bike racing, kart racing, track days, silverstone, spa francorchamps, nurburgring, yas marina, dubai autodrome, bedford autodrome, brands hatch, racing circuits worldwide",
  openGraph: {
    title: "Car, Bike & Kart Race Tracks Worldwide | LapSnaps",
    description:
      "Explore car, bike & kart circuits from around the world. Browse iconic race tracks and find track days.",
    url: "https://lapsnaps.com/tracks",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Car, Bike & Kart Race Tracks Worldwide | LapSnaps",
    description: "Explore car, bike & kart circuits from around the world.",
  },
  alternates: {
    canonical: "https://lapsnaps.com/tracks",
  },
}

export default async function TracksPage({ searchParams }) {
  const params = await searchParams
  const page = params?.page ? Number.parseInt(params.page, 10) : 1
  const search = params?.search || ""

  let tracks = []
  let pagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 100,
  }
  let error = null

  try {
    const response = await getTracks({
      limit: 100,
      page: page,
      search: search,
    })

    if (response.success) {
      tracks = response.data || []
      pagination = {
        currentPage: response.currentPage || page,
        totalPages: response.count || 1,
        totalItems: response.total || 0,
        itemsPerPage: 100,
      }
    } else {
      error = "Failed to load tracks"
    }
  } catch (err) {
    console.error("Error fetching tracks:", err)
    error = "Unable to load tracks. Please try again later."
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Car, Bike & Kart Race Tracks Worldwide",
    description:
      "Explore car, bike & kart circuits from around the world. Browse iconic race tracks including Silverstone, Spa-Francorchamps, Nürburgring and more.",
    url: "https://lapsnaps.com/tracks",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: tracks.map((track, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SportsActivityLocation",
          "@id": `https://lapsnaps.com/tracks/${track.slug || track._id}`,
          name: track.name || "Unknown Track",
          description:
            track.description || `Professional motorsport photography from ${track.name || "this race track"}`,
          image: track.bannerImage?.url || track.thumbnailImage?.url,
          url: `https://lapsnaps.com/tracks/${track.slug || track._id}`,
          ...(track.city &&
            track.country && {
              address: {
                "@type": "PostalAddress",
                addressLocality: track.city,
                addressCountry: track.country,
              },
            }),
          ...(track.latitude &&
            track.longitude && {
              geo: {
                "@type": "GeoCoordinates",
                latitude: track.latitude,
                longitude: track.longitude,
              },
            }),
        },
      })),
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://lapsnaps.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tracks",
        item: "https://lapsnaps.com/tracks",
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <TracksServerPage tracks={tracks} pagination={pagination} searchTerm={search} />

      <div style={{ display: "none" }}>
        <TracksClientPage
          initialTracks={tracks}
          initialPagination={pagination}
          initialError={error}
          initialSearch={search}
        />
      </div>
    </>
  )
}
