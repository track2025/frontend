import { notFound } from 'next/navigation';
import { getTrackBySlug } from 'src/services/tracks';
import TrackDetailsClient from 'src/components/_main/track/TrackDetailsClient';
import TrackDetailsServer from 'src/components/_main/track/TrackDetailsServer';
import { getProducts } from 'src/services';
import { getTrackEventsByTrackSlug } from 'src/services/tracks';

export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    const response = await getTrackBySlug(slug);

    if (!response.success || !response.data) {
      return {
        title: 'Track Not Found | LapSnaps',
        description: 'The requested race track could not be found.'
      };
    }

    const track = response.data;

    const trackName = track.name || 'Race Track';
    const trackCity = track.city || '';
    const trackCountry = track.country || '';
    const trackDescription = track.description || `Explore ${trackName} motorsport track details, events, and gallery.`;

    const locationParts = [];
    if (trackCity) locationParts.push(trackCity);
    if (trackCountry) locationParts.push(trackCountry);
    const location = locationParts.join(', ') || '';

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
                  alt: `${trackName} race track`
                }
              ]
            : [],
        type: 'website',
        url: `https://lapsnaps.com/tracks/${track.slug}`,
        siteName: 'LapSnaps'
      },
      twitter: {
        card: 'summary_large_image',
        title: trackName,
        description: location ? `Race track in ${location}` : trackDescription,
        images:
          track.bannerImage?.url || track.thumbnailImage?.url
            ? [track.bannerImage?.url || track.thumbnailImage?.url]
            : []
      },
      alternates: {
        canonical: `https://lapsnaps.com/tracks/${track.slug}`
      }
    };
  } catch (error) {
    return {
      title: 'Race Track | LapSnaps',
      description: 'Explore race tracks and motorsport circuits worldwide.'
    };
  }
}

export default async function TrackDetailsPage({ params }) {
  const { slug } = params;

  try {
    const trackResponse = await getTrackBySlug(slug);
    const trackProducts = await getProducts('?location=' + trackResponse?.data?.name + '&limit=10');
    const products = trackProducts.success ? trackProducts.data : [];
    const eventsData = await getTrackEventsByTrackSlug(slug);
    const upcomingEvents = eventsData?.data || [];

    if (!trackResponse.success || !trackResponse.data) {
      notFound();
    }

    const track = trackResponse.data;

    // Fixed: Added missing URL field for SportsActivityLocation
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'SportsActivityLocation',
      '@id': `https://lapsnaps.com/tracks/${track.slug}`,
      name: track.name,
      description: track.description || `Professional motorsport photography from ${track.name}`,
      image: track.bannerImage?.url || track.thumbnailImage?.url,
      url: `https://lapsnaps.com/tracks/${track.slug}`, // ✅ REQUIRED: Was missing
      address: {
        '@type': 'PostalAddress',
        addressLocality: track.city,
        addressCountry: track.country
      },
      ...(track.latitude &&
        track.longitude && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: track.latitude,
            longitude: track.longitude
          }
        }),
      ...(track.latitude &&
        track.longitude && {
          hasMap: `https://www.google.com/maps?q=${track.latitude},${track.longitude}`
        })
    };

    // Fixed: Complete Product schema with all required fields
    const productStructuredData =
      products.length > 0
        ? products.map((product, index) => {
            // Format date to YYYY-MM-DD (matching the card component)
            const formatDate = (dateStr) => {
              if (!dateStr) return '2025';
              const date = new Date(dateStr);
              const yyyy = date.getFullYear();
              const mm = String(date.getMonth() + 1).padStart(2, '0');
              const dd = String(date.getDate()).padStart(2, '0');
              return `${yyyy}-${mm}-${dd}`;
            };

            // Slugify location (matching the card component)
            const slugify = (text) => {
              if (!text) return 'race-track';
              return text
                .toString()
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
            };

            const locationSlug = slugify(product.location);
            const dateSlug = formatDate(product.dateCaptured);
            const productUrl = `/event/${locationSlug}/${dateSlug}/pictures/${product.slug}`;
            const fullProductUrl = `https://lapsnaps.com${productUrl}`;

            return {
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.name || `Photo captured at ${product.location || track.name}`,
              description:
                product.description ||
                `Professional motorsport photography captured at ${product.location || track.name}`,
              image: product.image?.url || '',
              url: fullProductUrl, // ✅ UPDATED: Now matches actual product URL structure
              sku: product._id || product.slug,
              mpn: product._id,
              brand: {
                '@type': 'Brand',
                name: product.photographer?.name || 'LapSnaps'
              },
              offers: {
                '@type': 'Offer',
                price: String(product.priceSale || product.price),
                priceCurrency: product.currency || 'GBP',
                availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                url: fullProductUrl, // ✅ UPDATED: Consistent URL
                ...(product.priceValidUntil && {
                  priceValidUntil: product.priceValidUntil
                })
              },
              ...(product.category && {
                category: product.category
              })
            };
          })
        : [];

    const faqStructuredData =
      Array.isArray(track.faqs) && track.faqs.length > 0
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: track.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
              }
            }))
          }
        : null;

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://lapsnaps.com'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tracks',
          item: 'https://lapsnaps.com/tracks'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: track.name,
          item: `https://lapsnaps.com/tracks/${track.slug}`
        }
      ]
    };

    return (
      <>
        {/* Track Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

        {/* Product Schemas - One for each product */}
        {productStructuredData.map((productSchema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
          />
        ))}

        {/* Breadcrumb Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

        {/* FAQ Schema */}
        {faqStructuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqStructuredData)
            }}
          />
        )}

        <TrackDetailsClient track={track} />
      </>
    );
  } catch (error) {
    console.error('Error fetching track:', error);
    notFound();
  }
}
