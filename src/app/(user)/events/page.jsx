'use client';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Grid, Card, CardActionArea, CardContent } from '@mui/material';
import eventsData from '../../../data/events.json';

export default function EventsPage() {
  const router = useRouter();

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
        featuredEvents: []
      };
    }

    countriesMap[event.countrySlug].eventCount++;

    // Check if event is upcoming (date is today or in the future)
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0); // Normalize to start of day

    if (eventDate >= today) {
      countriesMap[event.countrySlug].upcomingEvents++;

      // Add featured events for this country (limit to 2)
      if (event.featured && countriesMap[event.countrySlug].featuredEvents.length < 2) {
        countriesMap[event.countrySlug].featuredEvents.push({
          title: event.title,
          date: event.date,
          trackName: event.trackName,
          type: event.type,
          image: event.thumbnailImage || event.image
        });
      }
    }
  });

  const countriesData = Object.values(countriesMap);

  // Country flag emojis map
  const flagMap = {
    AE: '🇦🇪',
    GB: '🇬🇧',
    IT: '🇮🇹',
    DE: '🇩🇪',
    BE: '🇧🇪',
    FR: '🇫🇷',
    ES: '🇪🇸',
    US: '🇺🇸'
  };

  // Sort by highest upcoming event count first, then by total events
  const sortedCountries = [...countriesData].sort((a, b) => {
    if (b.upcomingEvents !== a.upcomingEvents) {
      return b.upcomingEvents - a.upcomingEvents;
    }
    return b.eventCount - a.eventCount;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Motorsport Events & Track Days Worldwide',
    description:
      'Browse upcoming car & bike motorsport events by country. Find track days, racing events, and motorsport photography opportunities worldwide.',
    url: 'https://lapsnaps.com/events',
    mainEntity: sortedCountries.map((country) => ({
      '@type': 'Country',
      name: country.name,
      eventCount: country.eventCount,
      upcomingEventCount: country.upcomingEvents
    }))
  };

  return (
    <>
      <title>Motorsport Events & Track Days Worldwide | LapSnaps</title>
      <meta
        name="description"
        content="Browse upcoming car & bike motorsport events by country. Find track days, racing events, and motorsport photography opportunities worldwide."
      />
      <meta
        name="keywords"
        content="motorsport events, track days, racing events, car events, bike events, motorsport calendar, track day calendar, racing calendar worldwide"
      />
      <link rel="canonical" href="https://lapsnaps.com/events" />

      <meta property="og:title" content="Motorsport Events & Track Days Worldwide | LapSnaps" />
      <meta property="og:description" content="Browse upcoming car & bike motorsport events by country." />
      <meta property="og:url" content="https://lapsnaps.com/events" />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Motorsport Events & Track Days Worldwide | LapSnaps" />
      <meta name="twitter:description" content="Browse upcoming car & bike motorsport events by country." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="xl">
          {/* H1 Heading */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' },
              fontWeight: 800,
              color: '#1a1a1a',
              textAlign: 'center',
              mb: 2
            }}
          >
            Upcoming Car & Bike Motorsport Events by Country
          </Typography>

          {/* H2 Subheading */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              fontWeight: 400,
              color: '#666',
              textAlign: 'center',
              mb: 6,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Discover {eventsData.filter((event) => new Date(event.date) >= today).length} upcoming events across{' '}
            {sortedCountries.length} countries
          </Typography>

          {/* Countries Grid */}
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
                  <CardActionArea onClick={() => router.push(`/events/${country.slug}`)} sx={{ height: '100%', p: 3 }}>
                    <CardContent sx={{ textAlign: 'center', p: 0 }}>
                      {/* Country Flag */}
                      <Typography
                        sx={{
                          fontSize: '4rem',
                          mb: 2,
                          lineHeight: 1
                        }}
                      >
                        {flagMap[country.countryCode] || '🏁'}
                      </Typography>

                      {/* Country Name - H3 */}
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: '#1a1a1a',
                          mb: 2
                        }}
                      >
                        {country.name}
                      </Typography>

                      {/* Event Count */}
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
                              color: '#666',
                              fontSize: '0.85rem'
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
                              color: '#666'
                            }}
                          >
                            {country.eventCount}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#666',
                              fontSize: '0.85rem'
                            }}
                          >
                            Total
                          </Typography>
                        </Box>
                      </Box>

                      {/* Featured Events Preview */}
                      {country.featuredEvents.length > 0 && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#666',
                              fontWeight: 600,
                              mb: 1,
                              fontSize: '0.8rem'
                            }}
                          >
                            Featured Events:
                          </Typography>
                          {country.featuredEvents.map((featuredEvent, eventIndex) => (
                            <Box
                              key={eventIndex}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 1,
                                p: 1,
                                borderRadius: 1,
                                backgroundColor: '#f8f9fa',
                                '&:last-child': {
                                  mb: 0
                                }
                              }}
                            >
                              <Box
                                sx={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 1,
                                  overflow: 'hidden',
                                  flexShrink: 0
                                }}
                              >
                                <Box
                                  component="img"
                                  src={featuredEvent.image}
                                  alt=""
                                  sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.style.background =
                                      'linear-gradient(135deg, #EE1E50 0%, #ff6b6b 100%)';
                                  }}
                                />
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: '#1a1a1a',
                                    fontSize: '0.75rem',
                                    lineHeight: 1.2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {featuredEvent.title}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: '#666',
                                    fontSize: '0.7rem'
                                  }}
                                >
                                  {formatDate(featuredEvent.date)} • {featuredEvent.trackName}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* No upcoming events message */}
                      {country.upcomingEvents === 0 && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#999',
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

          {/* Summary Stats */}
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                fontSize: '0.9rem'
              }}
            >
              Showing {sortedCountries.length} countries with {eventsData.length} total events •{' '}
              {eventsData.filter((event) => new Date(event.date) >= today).length} upcoming events
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}
