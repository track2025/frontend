'use client';
import { useParams, useRouter } from 'next/navigation';
import { Box, Container, Typography, Breadcrumbs, Link, Grid, Card, CardContent, Chip, Button } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import eventsData from '../../../../data/events.json';

export default function CountryEventsPage() {
  const params = useParams();
  const router = useRouter();
  const countrySlug = params?.country;

  // Get today's date for filtering upcoming events
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter events for this country and only show upcoming ones
  const countryEvents = eventsData
    .filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return event.countrySlug === countrySlug && eventDate >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending

  // Get country info from first event
  const countryInfo = countryEvents[0] || {
    country: 'Country',
    countrySlug: countrySlug,
    countryCode: 'XX'
  };

  // Country flag emojis map
  const flagMap = {
    AE: '🇦🇪',
    GB: '🇬🇧',
    IT: '🇮🇹',
    DE: '🇩🇪',
    BE: '🇧🇪',
    FR: '🇫🇷',
    ES: '🇪🇸',
    US: '🇺🇸',
    uae: '🇦🇪',
    uk: '🇬🇧',
    'united-kingdom': '🇬🇧',
    belgium: '🇧🇪'
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeRange = (startTime, endTime) => {
    return `${startTime} - ${endTime}`;
  };

  // Get event type color
  const getEventTypeColor = (type) => {
    const colors = {
      'Track Day': '#1976d2',
      Racing: '#d32f2f',
      'Beginner Friendly': '#388e3c',
      Motorcycle: '#ed6c02',
      Advanced: '#7b1fa2',
      'Open Track': '#0288d1'
    };
    return colors[type] || '#666';
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${countryInfo.country} Motorsport Events & Track Days`,
    description: `Browse ${countryEvents.length} upcoming motorsport events and track days in ${countryInfo.country}.`,
    url: `https://lapsnaps.com/events/${countrySlug}`,
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

  return (
    <>
      <title>{countryInfo.country} Motorsport Events & Track Days | LapSnaps</title>
      <meta
        name="description"
        content={`Browse ${countryEvents.length} upcoming motorsport events and track days in ${countryInfo.country}. Find car & bike racing events, track days, and motorsport photography opportunities.`}
      />
      <meta
        name="keywords"
        content={`${countryInfo.country} motorsport events, ${countryInfo.country} track days, ${countryInfo.country} racing events, ${countryInfo.country} car events, ${countryInfo.country} bike events`}
      />
      <link rel="canonical" href={`https://lapsnaps.com/events/${countrySlug}`} />

      <meta property="og:title" content={`${countryInfo.country} Motorsport Events & Track Days | LapSnaps`} />
      <meta
        property="og:description"
        content={`Browse ${countryEvents.length} upcoming motorsport events in ${countryInfo.country}.`}
      />
      <meta property="og:url" content={`https://lapsnaps.com/events/${countrySlug}`} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${countryInfo.country} Motorsport Events & Track Days`} />
      <meta name="twitter:description" content={`Browse ${countryEvents.length} upcoming motorsport events.`} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Container maxWidth="xl">
          {/* Breadcrumbs */}
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }} aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              href="/events"
              sx={{ cursor: 'pointer', '&:hover': { color: '#EE1E50' } }}
            >
              Events
            </Link>
            <Typography color="text.primary">{countryInfo.country}</Typography>
          </Breadcrumbs>

          {/* Back Button */}
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/events')} sx={{ mb: 3, color: '#666' }}>
            Back to All Events
          </Button>

          {/* Header with Flag */}
          <Box
            sx={{
              textAlign: 'center',
              mb: 4,
              p: { xs: 3, md: 4 },
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
            }}
          >
            <Typography sx={{ fontSize: '4rem', mb: 2, lineHeight: 1 }}>
              {flagMap[countryInfo.countryCode] || flagMap[countrySlug] || '🏁'}
            </Typography>

            {/* H1 Heading */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' },
                fontWeight: 800,
                color: '#1a1a1a',
                mb: 1
              }}
            >
              Motorsport Events in {countryInfo.country}
            </Typography>

            {/* H2 Subheading */}
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                fontWeight: 400,
                color: '#666',
                mb: 2
              }}
            >
              Upcoming car & bike track days and racing events
            </Typography>

            <Chip
              label={`${countryEvents.length} Upcoming Events`}
              sx={{
                bgcolor: '#EE1E50',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9rem',
                px: 2,
                py: 1.5
              }}
            />
          </Box>

          {/* Events List */}
          {countryEvents.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: 2
              }}
            >
              <Typography variant="h4" sx={{ color: '#666', mb: 2 }}>
                No Upcoming Events
              </Typography>
              <Typography variant="body1" sx={{ color: '#999', mb: 3 }}>
                There are currently no upcoming events in {countryInfo.country}.
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push('/events')}
                sx={{
                  bgcolor: '#EE1E50',
                  '&:hover': { bgcolor: '#d81b60' }
                }}
              >
                Browse All Countries
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {countryEvents.map((event, index) => (
                <Grid item size={12} key={event.id}>
                  <Card
                    sx={{
                      boxShadow: 1,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.12)'
                      }
                    }}
                    onClick={() => router.push(`/tracks/${event.trackSlug}/events/${event.slug}`)}
                  >
                    <CardContent>
                      <Grid container spacing={0}>
                        {/* Event Image - Full height */}
                        <Grid item size={{ xs: 12, sm: 3, md: 3 }}>
                          <Box
                            sx={{
                              height: { xs: 180, sm: '100%' },
                              minHeight: { sm: 200 },
                              position: 'relative',
                              overflow: 'hidden',
                              bgcolor: 'linear-gradient(135deg, #EE1E50 0%, #ff6b6b 100%)'
                            }}
                          >
                            <Box
                              component="img"
                              src={event.image || event.thumbnailImage}
                              alt={event.title}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.style.background =
                                  'linear-gradient(135deg, #EE1E50 0%, #ff6b6b 100%)';
                              }}
                            />
                          </Box>
                        </Grid>

                        {/* Event Details */}
                        <Grid item size={{ xs: 12, sm: 9, md: 9 }}>
                          <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                            {/* Event Type and Category Chips */}
                            <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                              <Chip
                                label={event.type}
                                size="small"
                                sx={{
                                  bgcolor: getEventTypeColor(event.type),
                                  color: 'white',
                                  fontWeight: 600,
                                  height: 24
                                }}
                              />
                              <Chip
                                label={event.category}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: '#EE1E50',
                                  color: '#EE1E50',
                                  fontWeight: 600,
                                  height: 24
                                }}
                              />
                              <Chip
                                label={event.status}
                                color={event.status === 'Open' ? 'success' : 'default'}
                                size="small"
                                sx={{ height: 24, ml: 'auto' }}
                              />
                            </Box>

                            {/* Event Title */}
                            <Typography
                              variant="h3"
                              sx={{
                                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                fontWeight: 700,
                                color: '#1a1a1a',
                                mb: 1.5,
                                lineHeight: 1.3
                              }}
                            >
                              {event.title}
                            </Typography>

                            {/* Event Details */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 2.5 }, mb: 1.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <CalendarTodayIcon sx={{ fontSize: 18, color: '#666' }} />
                                <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                                  {formatDate(event.date)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <AccessTimeIcon sx={{ fontSize: 18, color: '#666' }} />
                                <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                                  {formatTimeRange(event.startTime, event.endTime)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <LocationOnIcon sx={{ fontSize: 18, color: '#666' }} />
                                <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                                  {event.trackName}
                                </Typography>
                              </Box>
                            </Box>

                            {/* Event Description */}
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#555',
                                lineHeight: 1.6,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {event.description}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}
