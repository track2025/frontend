'use client';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Button
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import eventsData from '../../../../../../data/events.json';
import { useEffect, useState } from 'react';
import { getSuperEvents } from 'src/services';
import LoadingSpinner from 'src/components/UI/Spinner';
import Head from 'next/head';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventSlug = params?.['events-slug'];
  const trackSlug = params?.slug;

  const [eventsData, setEventData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fethcItems = async () => {
    setIsLoading(true);
    const data = await getSuperEvents();
    setIsLoading(false);
    setEventData(data);
  };

  useEffect(() => {
    fethcItems();
  }, []);

  // Find the event by slug
  const eventData = eventsData.find((event) => event.slug === eventSlug);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  // If event not found, show 404
  if (!eventData && isLoading === false) {
    return (
      <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ textAlign: 'center', mt: 4 }}>
            Event Not Found
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/events')}
            sx={{ mt: 2, mx: 'auto', display: 'block' }}
          >
            Back to Events
          </Button>
        </Container>
      </Box>
    );
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

  const formatTime = (startTime, endTime) => {
    return `${startTime} - ${endTime}`;
  };

  console.log('eventData.image', eventData.image);

  // Generate gallery images using real motorsport images
  const galleryImages = [
    eventData.image
    // eventData.thumbnailImage,
    // 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    // 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    // 'https://images.unsplash.com/photo-1593941707882-a5bba5337b2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    // 'https://images.unsplash.com/photo-1591768575198-88b92c8d1c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  ].filter(Boolean); // Remove any undefined images

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
    organizer: {
      '@type': 'Organization',
      name: 'Lap Snaps'
    }
  };

  return (
    <>
      <Head>
        <title>
          {eventData.metaTitle ||
            `${eventData.title} - ${formatDate(eventData.date)} | ${eventData.trackName} | LapSnaps`}
        </title>
        <meta
          name="description"
          content={
            eventData.metaDescription ||
            `${eventData.title} at ${eventData.trackName} on ${formatDate(eventData.date)}. ${eventData.description}`
          }
        />
        <meta
          name="keywords"
          content={
            eventData.keywords?.join(', ') ||
            `${eventData.title}, ${eventData.trackName}, ${eventData.type}, ${eventData.category}, motorsport event, track day, racing event`
          }
        />
        <link rel="canonical" href={`https://lapsnaps.com/tracks/${trackSlug}/events/${eventData.slug}`} />
        <meta
          property="og:title"
          content={`${eventData.title} - ${formatDate(eventData.date)} | ${eventData.trackName}`}
        />
        <meta property="og:description" content={eventData.description} />
        <meta property="og:url" content={`https://lapsnaps.com/tracks/${trackSlug}/events/${eventData.slug}`} />
        <meta property="og:type" content="event" />
        <meta property="og:image" content={eventData.image?.url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${eventData.title} - ${eventData.trackName}`} />
        <meta name="twitter:description" content={eventData.description} />
        <meta name="twitter:image" content={eventData.image?.url} />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Box sx={{ minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Container maxWidth="xl">
          {/* Breadcrumbs */}
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }} aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              href="/tracks"
              sx={{ cursor: 'pointer', '&:hover': { color: '#EE1E50' } }}
            >
              Tracks
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href={`/tracks/${trackSlug}`}
              sx={{ cursor: 'pointer', '&:hover': { color: '#EE1E50' } }}
            >
              {eventData.trackName}
            </Link>
            <Typography color="text.primary">{eventData.title}</Typography>
          </Breadcrumbs>

          {/* Back Button */}
          {/* <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push(`/tracks/${trackSlug}`)}
            sx={{ mb: 3, color: '#666' }}
          >
            Back to {eventData.trackName}
          </Button> */}

          {/* Banner Image */}
          <Box
            sx={{
              width: '100%',
              height: { xs: 250, sm: 350, md: 450 },
              borderRadius: 2,
              overflow: 'hidden',
              mb: 4,
              position: 'relative',
              backgroundColor: '#e0e0e0' // Fallback background color
            }}
          >
            <Box
              component="img"
              src={eventData.image.url}
              alt={`${eventData.title} at ${eventData.trackName} - ${formatDate(eventData.date)} motorsport event`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
              onError={(e) => {
                // Fallback if image fails to load
                e.target.style.display = 'none';
                e.target.parentElement.style.background = 'linear-gradient(135deg, #EE1E50 0%, #ff6b6b 100%)';
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                p: 3
              }}
            >
              <Chip
                label={eventData.category}
                sx={{
                  bgcolor: '#EE1E50',
                  color: 'white',
                  fontWeight: 600,
                  mb: 2
                }}
              />
              {/* H1 Heading */}
              <Typography
                variant="h1"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                {eventData.title}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={4}>
            {/* Main Content - Full Width */}
            <Grid item size={12}>
              {/* Event Details Card */}
              <Card sx={{ mb: 4, boxShadow: 2 }}>
                <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                  <Grid container spacing={3}>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CalendarTodayIcon sx={{ color: '#EE1E50' }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                            Date
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {formatDate(eventData.date)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <AccessTimeIcon sx={{ color: '#EE1E50' }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                            Time
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {formatTime(eventData.startTime, eventData.endTime)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <LocationOnIcon sx={{ color: '#EE1E50' }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                            Location
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {eventData.trackName}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Event Description - Only show if there's content */}
              {eventData.content && (
                <Card sx={{ mb: 4, boxShadow: 2 }}>
                  <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        fontSize: { xs: '1.5rem', md: '1.75rem' }
                      }}
                    >
                      About This Event
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Box
                      dangerouslySetInnerHTML={{ __html: eventData.content }}
                      sx={{
                        // Base styles for rich text content
                        '& *': {
                          maxWidth: '100%'
                        },
                        '& p': {
                          fontSize: '16px',
                          lineHeight: 1.7,
                          color: '#333',
                          mb: 2
                        },
                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                          fontWeight: 600,
                          color: '#1a1a1a',
                          mt: 3,
                          mb: 1.5,
                          lineHeight: 1.3
                        },
                        '& h1': {
                          fontSize: '1.75rem'
                        },
                        '& h2': {
                          fontSize: '1.5rem'
                        },
                        '& h3': {
                          fontSize: '1.25rem'
                        },
                        '& h4': {
                          fontSize: '1.125rem'
                        },
                        '& h5, & h6': {
                          fontSize: '1rem'
                        },
                        '& ul, & ol': {
                          pl: 3,
                          mb: 2
                        },
                        '& li': {
                          mb: 1,
                          lineHeight: 1.6
                        },
                        '& blockquote': {
                          borderLeft: '4px solid #EE1E50',
                          pl: 2,
                          ml: 0,
                          py: 1,
                          mb: 2,
                          backgroundColor: '#f8f9fa',
                          fontStyle: 'italic'
                        },
                        '& strong, & b': {
                          fontWeight: 700
                        },
                        '& em, & i': {
                          fontStyle: 'italic'
                        },
                        '& u': {
                          textDecoration: 'underline'
                        },
                        '& a': {
                          color: '#EE1E50',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        },
                        '& img': {
                          maxWidth: '100%',
                          height: 'auto',
                          borderRadius: 1,
                          my: 2
                        },
                        '& table': {
                          width: '100%',
                          borderCollapse: 'collapse',
                          mb: 2
                        },
                        '& th, & td': {
                          border: '1px solid #e0e0e0',
                          padding: '8px 12px',
                          textAlign: 'left'
                        },
                        '& th': {
                          backgroundColor: '#f5f5f5',
                          fontWeight: 600
                        },
                        '& code': {
                          backgroundColor: '#f5f5f5',
                          padding: '2px 4px',
                          borderRadius: '3px',
                          fontFamily: 'monospace',
                          fontSize: '0.9em'
                        },
                        '& pre': {
                          backgroundColor: '#f5f5f5',
                          padding: '16px',
                          borderRadius: '4px',
                          overflow: 'auto',
                          mb: 2,
                          fontFamily: 'monospace',
                          fontSize: '0.9em'
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
