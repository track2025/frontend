import { notFound } from 'next/navigation';
import { getSuperEvents } from 'src/services';
import EventDetailClient from 'src/components/_main/events/EventDetailClient';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug, 'events-slug': eventSlug } = params;

  try {
    const eventsData = await getSuperEvents();
    const eventData = eventsData.find((event) => event.slug === eventSlug);

    if (!eventData) {
      return {
        title: 'Event Not Found | LapSnaps',
        description: 'The requested event could not be found.'
      };
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    };

    // const structuredData = {
    //   '@context': 'https://schema.org',
    //   '@type': 'Event',
    //   name: eventData.title,
    //   description: eventData.description,
    //   startDate: eventData.date,
    //   endDate: eventData.date,
    //   eventStatus: 'https://schema.org/EventScheduled',
    //   eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    //   location: {
    //     '@type': 'Place',
    //     name: eventData.trackName,
    //     address: {
    //       '@type': 'PostalAddress',
    //       addressCountry: eventData.country
    //     }
    //   },
    //   image: eventData.image?.url,
    //   organizer: {
    //     '@type': 'Organization',
    //     name: 'Lap Snaps'
    //   }
    // };

    return {
      title:
        eventData.metaTitle || `${eventData.title} - ${formatDate(eventData.date)} | ${eventData.trackName} | LapSnaps`,
      description:
        eventData.metaDescription ||
        `${eventData.title} at ${eventData.trackName} on ${formatDate(eventData.date)}. ${eventData.description}`,
      keywords:
        eventData.keywords?.join(', ') ||
        `${eventData.title}, ${eventData.trackName}, ${eventData.category}, motorsport event, track day, racing event`,
      openGraph: {
        title: `${eventData.title} - ${formatDate(eventData.date)} | ${eventData.trackName}`,
        description: eventData.description,
        images: [eventData.image?.url],
        type: 'website', // Changed from "event" to "website"
        url: `https://lapsnaps.com/tracks/${slug}/events/${eventData.slug}`
      },
      twitter: {
        card: 'summary_large_image',
        title: `${eventData.title} - ${eventData.trackName}`,
        description: eventData.description,
        images: [eventData.image?.url]
      },
      alternates: {
        canonical: `https://lapsnaps.com/tracks/${slug}/events/${eventData.slug}`
      },
      // other: {
      //   structuredData: JSON.stringify(structuredData)
      // }
    };
  } catch (error) {
    return {
      title: 'Motorsport Event | LapSnaps',
      description: 'Browse upcoming motorsport events and track days.'
    };
  }
}

// Main page component
export default async function EventDetailPage({ params }) {
  const { slug, 'events-slug': eventSlug } = params;

  try {
    const eventsData = await getSuperEvents();
    const eventData = eventsData.find((event) => event.slug === eventSlug);

    if (!eventData) {
      notFound();
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: eventData.title,
      description: eventData.description,
      startDate: eventData.date,
      endDate: eventData.date,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: eventData.trackName,
        address: {
          '@type': 'PostalAddress',
          addressCountry: eventData.country
        }
      },
      image: eventData.image?.url,
      provider: {
        '@type': 'Organization',
        name: 'Lap Snaps'
      }
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <EventDetailClient eventData={eventData} trackSlug={slug} />
      </>
    );
  } catch (error) {
    console.error('Error fetching event:', error);
    notFound();
  }
}
