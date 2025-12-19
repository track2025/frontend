import Link from 'next/link';
import { Box, Container, Typography, Grid, Card, CardActionArea, CardContent } from '@mui/material';
import { getSuperEvents } from 'src/services';
import { getCountryFlag } from 'src/utils/flags';
import EventCardImage from 'src/components/_main/events/EventCardImage';

export const metadata = {
  title: 'Motorsport Events & Track Days Worldwide | LapSnaps',
  description:
    'Browse upcoming car & bike motorsport events by country. Find track days, racing events, and motorsport photography opportunities worldwide.',
  keywords:
    'motorsport events, track days, racing events, car events, bike events, motorsport calendar, track day calendar, racing calendar worldwide',
  openGraph: {
    title: 'Motorsport Events & Track Days Worldwide | LapSnaps',
    description: 'Browse upcoming car & bike motorsport events by country.',
    url: 'https://lapsnaps.com/events',
    type: 'website',
    images: [
      {
        url: 'https://lapsnaps.com/og-events-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Motorsport Events & Track Days Worldwide'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Motorsport Events & Track Days Worldwide | LapSnaps',
    description: 'Browse upcoming car & bike motorsport events by country.',
    images: ['https://lapsnaps.com/twitter-events-image.jpg']
  },
  alternates: {
    canonical: 'https://lapsnaps.com/events'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export const dynamic = 'force-dynamic';

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
// const buildOfferObject = (event) => ({
//   '@type': 'Offer',
//   url: `https://lapsnaps.com/events/${event.countrySlug}/${event.slug}`,
//   availability: 'https://schema.org/InStock',
//   priceCurrency: 'GBP', // Default currency
//   category: 'Motorsport Event'
// });

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

export default async function EventsPage() {
  const eventsData = await getSuperEvents();
  // console.log('Events data:', eventsData);

  // Get today's date at start of day for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const countriesMap = {};

  eventsData.forEach((event) => {
    if (!countriesMap[event.countrySlug]) {
      countriesMap[event.countrySlug] = {
        slug: event.countrySlug,
        name: event.country,
        countryCode: event.countryCode,
        eventCount: 0,
        upcomingEvents: 0,
        featuredEvents: [],
        allEvents: []
      };
    }

    countriesMap[event.countrySlug].eventCount++;
    countriesMap[event.countrySlug].allEvents.push(event);

    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate >= today) {
      countriesMap[event.countrySlug].upcomingEvents++;

      if (event.featured && countriesMap[event.countrySlug].featuredEvents.length < 2) {
        countriesMap[event.countrySlug].featuredEvents.push({
          title: event.title,
          date: event.date,
          trackName: event.trackName,
          image: event.image,
          slug: event.slug
        });
      }
    }
  });

  const countriesData = Object.values(countriesMap);

  const sortedCountries = [...countriesData].sort((a, b) => {
    if (b.upcomingEvents !== a.upcomingEvents) {
      return b.upcomingEvents - a.upcomingEvents;
    }
    return b.eventCount - a.eventCount;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Create clean Event schemas for all events
  const eventSchemas = eventsData.map((event, index) => {
    const eventUrl = `https://lapsnaps.com/events/${event.countrySlug}/${event.slug}`;
    const dateTime = buildDateTime(event);

    // Base event schema with required fields
    const baseSchema = {
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
      // offers: buildOfferObject(event),
      // organizer: buildOrganizerObject()
      provider: buildOrganizerObject(),
      sameAs: [
        event.website || 'https://lapsnaps.com',
        event.facebookUrl || 'https://www.facebook.com/lapsnaps',
        'https://www.instagram.com/lapsnaps',
        'https://twitter.com/lapsnaps'
      ].filter(Boolean)
    };

    // Add optional fields if available
    const cleanSchema = {
      ...baseSchema,
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
      }),

      // Add performer (the track/circuit)
      performer: {
        '@type': 'SportsTeam',
        name: event.trackName,
        location: buildLocationObject(event)
      },

      // Add country context
      ...(event.country && {
        areaServed: event.country,
        location: {
          ...baseSchema.location,
          ...(event.country && {
            containedInPlace: {
              '@type': 'Country',
              name: event.country
            }
          })
        }
      })
    };

    return cleanSchema;
  });

  // Enhanced CollectionPage schema
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Motorsport Events & Track Days Worldwide',
    description:
      'Browse upcoming car & bike motorsport events worldwide. Find track days, racing events, and motorsport photography opportunities.',
    url: 'https://lapsnaps.com/events',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: eventsData.length,
      itemListElement: sortedCountries.map((country, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Place',
          name: country.name,
          url: `https://lapsnaps.com/events/${country.slug}`,
          description: `${country.upcomingEvents} upcoming motorsport events in ${country.name}`,
          address: {
            '@type': 'PostalAddress',
            addressCountry: country.name
          },
          // Add country-specific event information
          ...(country.upcomingEvents > 0 && {
            event: {
              '@type': 'Event',
              name: `Motorsport Events in ${country.name}`,
              startDate: today.toISOString().split('T')[0],
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              location: {
                '@type': 'Place',
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: country.name
                }
              }
            }
          })
        }
      }))
    },
    // Add aggregate event data
    about: {
      '@type': 'SportsOrganization',
      name: 'LapSnaps Motorsport Events',
      description: 'Organizer of motorsport events and track days worldwide'
    },
    ...(eventsData.length > 0 && {
      temporalCoverage: {
        startDate: eventsData.reduce(
          (earliest, event) => (event.date < earliest ? event.date : earliest),
          eventsData[0].date
        ),
        endDate: eventsData.reduce((latest, event) => (event.date > latest ? event.date : latest), eventsData[0].date)
      }
    })
  };

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
      }
    ]
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Event Schemas */}
      {eventSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <Box sx={{ minHeight: '100vh', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="xl">
          {/* H1 - Main Page Title */}
          <Typography
            component="h1"
            variant="h1"
            sx={{
              fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' },
              fontWeight: 800,
              textAlign: 'center',
              mb: 2,
              color: 'text.primary'
            }}
          >
            Upcoming Car & Bike Motorsport Events by Country
          </Typography>

          {/* H2 - Subtitle */}
          <Typography
            component="h2"
            variant="h2"
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              fontWeight: 400,
              textAlign: 'center',
              mb: 6,
              maxWidth: '800px',
              mx: 'auto',
              color: 'text.secondary'
            }}
          >
            Discover {eventsData.filter((event) => new Date(event.date) >= today).length} upcoming events across{' '}
            {sortedCountries.length} countries
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              fontWeight: 400,
              textAlign: 'center',
              mb: 6,
              maxWidth: '800px',
              mx: 'auto',
              color: 'text.secondary'
            }}
          >
            Browse upcoming car and bike track-day events, racing weekends, and motorsport sessions around the world. Find
            dates, locations, and circuits where photographers capture and upload images on LapSnaps.
          </Typography>

          <Grid container spacing={3}>
            {sortedCountries.map((country, index) => (
              <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={country.slug}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 32px rgba(238, 30, 80, 0.2)'
                    }
                  }}
                >
                  {index < 3 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        bgcolor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                        color: 'white',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        zIndex: 1,
                        border: '3px solid white'
                      }}
                    >
                      #{index + 1}
                    </Box>
                  )}
                  <CardActionArea component={Link} href={`/events/${country.slug}`} sx={{ height: '100%', p: 3 }}>
                    <CardContent sx={{ textAlign: 'center', p: 0 }}>
                      <Typography
                        sx={{
                          fontSize: '4rem',
                          mb: 2,
                          lineHeight: 1
                        }}
                      >
                        {getCountryFlag(country.countryCode)}
                      </Typography>

                      {/* H3 - Country Name */}
                      <Typography
                        component="h3"
                        variant="h3"
                        sx={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          mb: 2,
                          color: 'text.primary'
                        }}
                      >
                        {country.name}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 3,
                          mb: country.featuredEvents.length > 0 ? 2 : 0
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '1.5rem',
                              fontWeight: 700,
                              color: '#EE1E50'
                            }}
                          >
                            {country.upcomingEvents}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '0.85rem',
                              color: 'text.secondary'
                            }}
                          >
                            Upcoming
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '1.5rem',
                              fontWeight: 700,
                              color: 'text.primary'
                            }}
                          >
                            {country.eventCount}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '0.85rem',
                              color: 'text.secondary'
                            }}
                          >
                            Total
                          </Typography>
                        </Box>
                      </Box>

                      {index <= 2 && (
                        <>
                          {country.featuredEvents.length > 0 && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
                              <Typography
                                component="h4"
                                variant="h4"
                                sx={{
                                  fontWeight: 600,
                                  mb: 1,
                                  fontSize: { xs: '15px', md: '20px' },
                                  textAlign: 'center',
                                  color: 'text.primary'
                                }}
                              >
                                Featured Events:
                              </Typography>
                              {country.featuredEvents.map((featuredEvent, eventIndex) => {
                                return (
                                  <Box
                                    key={eventIndex}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                      mb: 1,
                                      p: 1,
                                      borderRadius: 1,
                                      '&:last-child': {
                                        mb: 0
                                      }
                                    }}
                                  >
                                    <EventCardImage imageUrl={featuredEvent.image.url} />
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                      <Typography
                                        component="h5"
                                        variant="h5"
                                        sx={{
                                          fontWeight: 600,
                                          fontSize: { xs: '15px', md: '15px' },
                                          lineHeight: 1.2,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          textAlign: 'left',
                                          color: 'text.primary'
                                        }}
                                      >
                                        {featuredEvent.title}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          lineHeight: 1.2,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          textAlign: 'left',
                                          fontSize: '0.7rem',
                                          marginTop: 0.5,
                                          color: 'text.secondary'
                                        }}
                                      >
                                        {formatDate(featuredEvent.date)} • {featuredEvent.trackName}
                                      </Typography>
                                    </Box>
                                  </Box>
                                );
                              })}
                            </Box>
                          )}
                        </>
                      )}

                      {country.upcomingEvents === 0 && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.disabled',
                              fontStyle: 'italic',
                              fontSize: '0.8rem'
                            }}
                          >
                            No upcoming events
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
