import { notFound } from 'next/navigation';
import { getTrackBySlug } from 'src/services/tracks';
import TrackDetailsClient from 'src/components/_main/track/TrackDetailsClient';

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

    // Safe data access with fallbacks
    const trackName = track.name || 'Race Track';
    const trackCity = track.city || '';
    const trackCountry = track.country || '';
    const trackDescription = track?.description
      ? track.description
      : `Explore ${trackName} motorsport track details, events, and gallery.`;

    // Build location string safely
    const locationParts = [];
    if (trackCity) locationParts.push(trackCity);
    if (trackCountry) locationParts.push(trackCountry);
    const location = locationParts.join(', ') || '';

    const metadata = {
      title: trackName,
      description: trackDescription,
      keywords: `${trackName}, ${trackCity}, ${trackCountry}, race track, motorsport circuit, track days`
        .replace(/ ,/g, ',')
        .trim(),
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
                  alt: trackName
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

    return metadata;
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
    // Fetch track data
    const trackResponse = await getTrackBySlug(slug);

    if (!trackResponse.success || !trackResponse.data) {
      notFound();
    }

    const track = trackResponse.data;

    return <TrackDetailsClient track={track} />;
  } catch (error) {
    console.error('Error fetching track:', error);
    notFound();
  }
}
