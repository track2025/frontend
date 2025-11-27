import { notFound } from 'next/navigation';
import { getSuperEvents } from 'src/services';
import CountryEventsClient from 'src/components/_main/events/CountryEventsClient';
import CountryEventsServer from 'src/components/_main/events/CountryEventsServer';

// Helper function to build location object safely
const buildLocationObject = (event) => {
  const location = {
    '@type': 'Place',
    name: event.trackName
  };

  // Build address if we have location data
  const address = {};

  if (event.address?.trim()) {
    address.streetAddress = event.address.trim();
  }

  if (event.city?.trim()) {
    address.addressLocality = event.city.trim();
  }

  if (event.postalCode?.trim()) {
    address.postalCode = event.postalCode.trim();
  }

  if (event.country?.trim()) {
    address.addressCountry = event.country.trim();
  }

  // Only add address if we have at least one component
  if (Object.keys(address).length > 0) {
    location.address = {
      '@type': 'PostalAddress',
      ...address
    };
  }

  return location;
};

// Helper function to build organizer object
const buildOrganizerObject = () => ({
  '@type': 'Organization',
  name: 'LapSnaps',
  url: 'https://lapsnaps.com',
  description: "Motorsport media platform where photographers upload and sell track-day photos and videos."

});

// Helper function to build offer object
// const buildOfferObject = (event, eventUrl) => ({
//   '@type': 'Offer',
//   url: eventUrl,
//   availability: 'https://schema.org/InStock',
//   priceCurrency: 'GBP',
//   category: 'Motorsport Event'
// });

// Helper function to build event URL
const buildEventUrl = (event) => {
  return `https://lapsnaps.com/tracks/${event.trackSlug}/events/${event.slug}`;
};

// Helper function to build date-time strings
const buildDateTime = (event) => {
  const baseDate = {
    startDate: event.date,
    endDate: event.endDate || event.date
  };

  // Add time components if available
  if (event.startTime) {
    baseDate.startDate = `${event.date}T${event.startTime}`;
    baseDate.doorTime = `${event.date}T${event.startTime}`;
  }

  if (event.endTime && event.endDate) {
    baseDate.endDate = `${event.endDate}T${event.endTime}`;
  } else if (event.endTime) {
    baseDate.endDate = `${event.date}T${event.endTime}`;
  }

  return baseDate;
};

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { country } = params;

  try {
    const eventsData = await getSuperEvents();
    const countryEvents = eventsData.filter((event) => event.countrySlug === country);
    const countryInfo = countryEvents[0] || {
      country: country.charAt(0).toUpperCase() + country.slice(1).replace(/-/g, ' '),
      countrySlug: country
    };

    if (countryEvents.length === 0) {
      return {
        title: `${countryInfo.country} Motorsport Events | LapSnaps`,
        description: `Find motorsport events and track days in ${countryInfo.country}. Browse car and bike racing events.`
      };
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${countryInfo.country} Motorsport Events & Track Days`,
      description: `Browse ${countryEvents.length} upcoming motorsport events and track days in ${countryInfo.country}.`,
      url: `https://lapsnaps.com/events/${country}`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: countryEvents.map((event, index) => {
          const eventUrl = buildEventUrl(event);
          const dateTime = buildDateTime(event);

          return {
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Event',
              '@id': eventUrl,
              name: event.title,
              description: event.description || `${event.title} at ${event.trackName}`,
              ...dateTime,
              eventStatus: 'https://schema.org/EventScheduled',
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              image: event.image?.url || '',
              location: buildLocationObject(event),
              // offers: buildOfferObject(event, eventUrl),
              // organizer: buildOrganizerObject(),
              provider: buildOrganizerObject(),
              sameAs: [
                event.website || 'https://lapsnaps.com',
                event.facebookUrl || 'https://www.facebook.com/lapsnaps',
                'https://www.instagram.com/lapsnaps',
                'https://twitter.com/lapsnaps'
              ].filter(Boolean),
              // Add performer (the track/circuit)
              performer: {
                '@type': 'SportsTeam',
                name: event.trackName,
                location: buildLocationObject(event)
              },
              // Add category if available
              ...(event.category && { category: event.category }),
              // Add status
              ...(event.status && {
                eventStatus:
                  event.status === 'Open'
                    ? 'https://schema.org/EventScheduled'
                    : event.status === 'Upcoming'
                      ? 'https://schema.org/EventScheduled'
                      : 'https://schema.org/EventPostponed'
              })
            }
          };
        })
      },
      // Add aggregate event data
      about: {
        '@type': 'SportsOrganization',
        name: 'LapSnaps Motorsport Events',
        description: 'Organizer of motorsport events and track days worldwide'
      },
      ...(countryEvents.length > 0 && {
        temporalCoverage: {
          startDate: countryEvents.reduce(
            (earliest, event) => (event.date < earliest ? event.date : earliest),
            countryEvents[0].date
          ),
          endDate: countryEvents.reduce(
            (latest, event) => (event.date > latest ? event.date : latest),
            countryEvents[0].date
          )
        }
      })
    };

    return {
      title: `${countryInfo.country} Motorsport Events & Track Days | LapSnaps`,
      description: `Browse ${countryEvents.length} upcoming motorsport events and track days in ${countryInfo.country}. Find car & bike racing events, track days, and motorsport photography opportunities.`,
      keywords: `${countryInfo.country} motorsport events, ${countryInfo.country} track days, ${countryInfo.country} racing events, ${countryInfo.country} car events, ${countryInfo.country} bike events`,
      openGraph: {
        title: `${countryInfo.country} Motorsport Events & Track Days | LapSnaps`,
        description: `Browse ${countryEvents.length} upcoming motorsport events in ${countryInfo.country}.`,
        url: `https://lapsnaps.com/events/${country}`,
        type: 'website'
      },
      twitter: {
        card: 'summary_large_image',
        title: `${countryInfo.country} Motorsport Events & Track Days`,
        description: `Browse ${countryEvents.length} upcoming motorsport events.`
      },
      alternates: {
        canonical: `https://lapsnaps.com/events/${country}`
      },
      other: {
        structuredData: JSON.stringify(structuredData)
      }
    };
  } catch (error) {
    return {
      title: 'Motorsport Events | LapSnaps',
      description: 'Browse upcoming motorsport events and track days worldwide.'
    };
  }
}

// Main page component
export default async function CountryEventsPage({ params }) {
  const { country } = params;

  try {
    const eventsData = await getSuperEvents();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const countryEvents = eventsData
      .filter((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return event.countrySlug === country && eventDate >= today;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // console.log('SSSS::', countryEvents);

    const countryInfo = countryEvents[0] || {
      country: 'this country',
      countrySlug: country,
      countryCode: country.toUpperCase()
    };

    // Create individual event schemas for better structured data
    const eventSchemas = countryEvents.map((event, index) => {
      const eventUrl = buildEventUrl(event);
      const dateTime = buildDateTime(event);

      return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.title,
        ...dateTime,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: buildLocationObject(event),
        description: event.description || `Motorsport event at ${event.trackName} in ${event.country}`,
        image: event.image?.url || 'https://lapsnaps.com/default-event-image.jpg',
        url: eventUrl,
        // offers: buildOfferObject(event, eventUrl),
        organizer: buildOrganizerObject(),
        sameAs: [
          event.website || 'https://lapsnaps.com',
          event.facebookUrl || 'https://www.facebook.com/lapsnaps',
          'https://www.instagram.com/lapsnaps',
          'https://twitter.com/lapsnaps'
        ].filter(Boolean),
        // Add performer (the track/circuit)
        performer: {
          '@type': 'SportsTeam',
          name: event.trackName,
          location: buildLocationObject(event)
        },
        // Add category if available
        ...(event.category && { category: event.category }),
        // Add status
        ...(event.status && {
          eventStatus:
            event.status === 'Open'
              ? 'https://schema.org/EventScheduled'
              : event.status === 'Upcoming'
                ? 'https://schema.org/EventScheduled'
                : 'https://schema.org/EventPostponed'
        })
      };
    });

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
          name: 'Events',
          item: 'https://lapsnaps.com/events'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: countryInfo.country,
          item: `https://lapsnaps.com/events/${country}`
        }
      ]
    };

    return (
      <>
        {/* Breadcrumb Schema */}
        <script
          key="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        {/* Individual Event Schemas */}
        {eventSchemas.map((schema, index) => (
          <script
            key={`event-schema-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

        <CountryEventsServer countryEvents={countryEvents} countryInfo={countryInfo} countrySlug={country} />

        <div style={{ display: 'none' }}>
          <CountryEventsClient countryEvents={countryEvents} countryInfo={countryInfo} countrySlug={country} />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching country events:', error);
    notFound();
  }
}
