import { notFound } from 'next/navigation';
import { getSuperEvents } from 'src/services';
import CountryEventsClient from 'src/components/_main/events/CountryEventsClient';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { country } = params;

  try {
    const eventsData = await getSuperEvents();

    // Filter events for this country
    const countryEvents = eventsData.filter((event) => event.countrySlug === country);

    // Get country info from first event
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
        itemListElement: countryEvents.map((event, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'SportsEvent',
            name: event.title,
            startDate: event.date,
            endDate: event.endDate,
            location: {
              '@type': 'Place',
              name: event.trackName,
              address: {
                '@type': 'PostalAddress',
                addressLocality: event.city,
                addressCountry: event.country
              }
            }
          }
        }))
      }
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

    // Filter events for this country and only show upcoming ones
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const countryEvents = eventsData
      .filter((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return event.countrySlug === country && eventDate >= today;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get country info from first event
    const countryInfo = countryEvents[0] || {
      // country: country.charAt(0).toUpperCase() + country.slice(1).replace(/-/g, ' '),
      country: 'this country',
      countrySlug: country,
      countryCode: country.toUpperCase()
    };

    return <CountryEventsClient countryEvents={countryEvents} countryInfo={countryInfo} countrySlug={country} />;
  } catch (error) {
    console.error('Error fetching country events:', error);
    notFound();
  }
}
