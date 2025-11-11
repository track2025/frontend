import { notFound } from "next/navigation"
import { getTrackBySlug } from "src/services/tracks"
import TrackDetailsClient from "src/components/_main/track/TrackDetailsClient"
import TrackDetailsServer from "src/components/_main/track/TrackDetailsServer"
import { getProducts } from "src/services"
import { getTrackEventsByTrackSlug } from "src/services/tracks"

export async function generateMetadata({ params }) {
  const { slug } = params

  try {
    const response = await getTrackBySlug(slug)

    if (!response.success || !response.data) {
      return {
        title: "Track Not Found | LapSnaps",
        description: "The requested race track could not be found.",
      }
    }

    const track = response.data

    const trackName = track.name || "Race Track"
    const trackCity = track.city || ""
    const trackCountry = track.country || ""
    const trackDescription = track.description || `Explore ${trackName} motorsport track details, events, and gallery.`

    const locationParts = []
    if (trackCity) locationParts.push(trackCity)
    if (trackCountry) locationParts.push(trackCountry)
    const location = locationParts.join(", ") || ""

    return {
      title: `${trackName} - ${location} | Race Track Details | Lap Snaps`,
      description: trackDescription,
      keywords: `${trackName}, ${trackCity}, ${trackCountry}, race track, motorsport circuit, track days, racing events`,
      openGraph: {
        title: trackName,
        description: location ? `Race track in ${location}` : trackDescription,
        images:
          track.bannerImage?.url || track.thumbnailImage?.url
            ? [
                {
                  url: track.bannerImage?.url || track.thumbnailImage?.url,
                  width: 1200,
                  height: 630,
                  alt: `${trackName} race track`,
                },
              ]
            : [],
        type: "website",
        url: `https://lapsnaps.com/tracks/${track.slug}`,
        siteName: "LapSnaps",
      },
      twitter: {
        card: "summary_large_image",
        title: trackName,
        description: location ? `Race track in ${location}` : trackDescription,
        images:
          track.bannerImage?.url || track.thumbnailImage?.url
            ? [track.bannerImage?.url || track.thumbnailImage?.url]
            : [],
      },
      alternates: {
        canonical: `https://lapsnaps.com/tracks/${track.slug}`,
      },
    }
  } catch (error) {
    return {
      title: "Race Track | LapSnaps",
      description: "Explore race tracks and motorsport circuits worldwide.",
    }
  }
}

export default async function TrackDetailsPage({ params }) {
  const { slug } = params

  try {
    const trackResponse = await getTrackBySlug(slug)
    const trackProducts = await getProducts("?location=" + trackResponse?.data?.name + "&limit=10")
    const products = trackProducts.success ? trackProducts.data : []
    const eventsData = await getTrackEventsByTrackSlug(slug)
    const upcomingEvents = eventsData?.data || []

    console.log("Fetched products for track:", products)

    if (!trackResponse.success || !trackResponse.data) {
      notFound()
    }

    const track = trackResponse.data

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SportsActivityLocation",
      "@id": `https://lapsnaps.com/tracks/${track.slug}`,
      name: track.name,
      description: track.description || `Professional motorsport photography from ${track.name}`,
      image: track.bannerImage?.url || track.thumbnailImage?.url,
      url: `https://lapsnaps.com/tracks/${track.slug}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: track.city,
        addressCountry: track.country,
      },
      ...(track.latitude &&
        track.longitude && {
          geo: {
            "@type": "GeoCoordinates",
            latitude: track.latitude,
            longitude: track.longitude,
          },
        }),
      ...(track.latitude &&
        track.longitude && {
          hasMap: `https://www.google.com/maps?q=${track.latitude},${track.longitude}`,
        }),
      ...(products.length > 0 && {
        about: {
          "@type": "ItemList",
          itemListElement: products.slice(0, 10).map((product, index) => {
            const name = product.name || `Photo captured at ${product.location || track.name}`
            const description =
              product.description ||
              `Captured at ${product.location || track.name} on ${new Date(
                product.dateCaptured,
              ).toLocaleDateString()}. Professionally taken and available for purchase.`

            return {
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Product",
                name,
                description,
                image: product.image?.url || "",
                url: `https://lapsnaps.com/products/${product.slug}`,
                sku: product._id,
                ...(product.priceSale && {
                  offers: {
                    "@type": "Offer",
                    price: String(product.priceSale),
                    priceCurrency: product.currency || "GBP",
                    availability: "https://schema.org/InStock",
                  },
                }),
              },
            }
          }),
        },
      }),
    }

    const faqStructuredData =
      Array.isArray(track.faqs) && track.faqs.length > 0
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: track.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }
        : null

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
        {
          "@type": "ListItem",
          position: 3,
          name: track.name,
          item: `https://lapsnaps.com/tracks/${track.slug}`,
        },
      ],
    }

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {faqStructuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqStructuredData),
            }}
          />
        )}
        <TrackDetailsServer track={track} upcomingEvents={upcomingEvents} />
        <div style={{ display: "none" }}>
          <TrackDetailsClient track={track} />
        </div>
      </>
    )
  } catch (error) {
    console.error("Error fetching track:", error)
    notFound()
  }
}
