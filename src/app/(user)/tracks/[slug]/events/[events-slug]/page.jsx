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
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import GroupIcon from '@mui/icons-material/Group';
import eventsData from '../../../../../../data/events.json';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventSlug = params?.['events-slug'];
  const trackSlug = params?.slug;

  // Find the event by slug
  const eventData = eventsData.find((event) => event.slug === eventSlug);

  // If event not found, show 404
  if (!eventData) {
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

  // Generate gallery images using real motorsport images
  const galleryImages = [
    eventData.image,
    eventData.thumbnailImage,
    'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    'https://images.unsplash.com/photo-1593941707882-a5bba5337b2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1591768575198-88b92c8d1c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  ].filter(Boolean); // Remove any undefined images

  return (
    <>
      {/* SEO Meta Tags */}
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
          `${eventData.title}, ${eventData.trackName}, ${eventData.type}, ${eventData.category}, motorsport event`
        }
      />
      <link rel="canonical" href={`https://lapsnaps.com/tracks/${trackSlug}/events/${eventData.slug}`} />

      <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
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
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push(`/tracks/${trackSlug}`)}
            sx={{ mb: 3, color: '#666' }}
          >
            Back to {eventData.trackName}
          </Button>

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
              src={eventData.image}
              alt={eventData.title}
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
            {/* Left Column - Main Content */}
            <Grid item size={{ xs: 12, lg: 8 }}>
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

              {/* Event Description */}
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
                    dangerouslySetInnerHTML={{ __html: eventData.fullDescription || `<p>${eventData.description}</p>` }}
                    sx={{
                      '& p': {
                        fontSize: '16px',
                        lineHeight: 1.7,
                        color: '#333',
                        mb: 2
                      },
                      '& h3': {
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        mt: 3,
                        mb: 1
                      },
                      '& ul': {
                        pl: 2,
                        mb: 2
                      },
                      '& li': {
                        mb: 1
                      }
                    }}
                  />
                </CardContent>
              </Card>

              {/* Event Schedule */}
              {eventData.schedule && eventData.schedule.length > 0 && (
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
                      Event Schedule
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <List>
                      {eventData.schedule.map((item, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <ScheduleIcon sx={{ color: '#EE1E50' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography sx={{ fontWeight: 600, color: '#1a1a1a' }}>{item.time}</Typography>}
                            secondary={<Typography sx={{ color: '#666' }}>{item.activity}</Typography>}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}

              {/* Event Gallery */}
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '1.5rem', md: '1.75rem' }
                }}
              >
                Event Gallery
              </Typography>
              <Grid container spacing={2}>
                {galleryImages.map((image, index) => (
                  <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Box
                      sx={{
                        height: { xs: 200, md: 250 },
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 2,
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.02)'
                        }
                      }}
                    >
                      <Box
                        component="img"
                        src={image}
                        alt={`${eventData.title} Photo ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          // Fallback for gallery images
                          e.target.style.display = 'none';
                          e.target.parentElement.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)';
                          e.target.parentElement.innerHTML = `
                            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">
                              <span>Image ${index + 1}</span>
                            </div>
                          `;
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Right Column - Sidebar */}
            <Grid item size={{ xs: 12, lg: 4 }}>
              {/* Event Info Card */}
              <Card sx={{ mb: 4, boxShadow: 2, position: 'sticky', top: 100 }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    Event Information
                  </Typography>

                  {/* Price - COMMENTED OUT */}
                  {/*
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#EE1E50', mb: 1 }}>
                      {eventData.price}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      per participant
                    </Typography>
                  </Box>
                  */}

                  {/* Capacity - COMMENTED OUT */}
                  {/*
                  {eventData.capacity && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <GroupIcon sx={{ color: '#EE1E50' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          Capacity
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {eventData.spotsLeft
                            ? `${eventData.spotsLeft} spots left`
                            : `${eventData.capacity} participants`}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  */}

                  {/* Status - COMMENTED OUT */}
                  {/*
                  <Chip
                    label={eventData.status}
                    color={eventData.status === 'Open' ? 'success' : 'default'}
                    sx={{ mb: 3 }}
                  />
                  */}

                  {/* Book Button - COMMENTED OUT */}
                  {/*
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      bgcolor: '#EE1E50',
                      '&:hover': { bgcolor: '#d81b60' },
                      mb: 2,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}
                    onClick={() => window.open(eventData.bookingUrl, '_blank')}
                  >
                    Book Now
                  </Button>
                  */}

                  {/* Requirements */}
                  {eventData.requirements && eventData.requirements.length > 0 && (
                    <>
                      <Divider sx={{ my: 3 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Requirements
                      </Typography>
                      <List dense>
                        {eventData.requirements.map((requirement, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircleIcon sx={{ color: '#EE1E50', fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText primary={requirement} />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}

                  {/* Included */}
                  {eventData.included && eventData.included.length > 0 && (
                    <>
                      <Divider sx={{ my: 3 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        What's Included
                      </Typography>
                      <List dense>
                        {eventData.included.map((item, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircleIcon sx={{ color: '#EE1E50', fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
