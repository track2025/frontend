'use client';
import { useRouter } from 'next/navigation';
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

export default function EventDetailClient({ eventData, trackSlug }) {
  const router = useRouter();

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

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        {/* Breadcrumbs */}

        {/* Banner Image */}
        <Box
          sx={{
            width: '100%',
            height: { xs: 250, sm: 350, md: 450 },
            borderRadius: 2,
            overflow: 'hidden',
            mb: 4,
            position: 'relative',
            backgroundColor: '#e0e0e0', // Fallback background color
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(0, 0, 0, 0.2)', // adjust opacity as needed
              zIndex: 1
            }
          }}
          style={{
            marginTop: -20
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 25,
              zIndex: 100
            }}
          >
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }} aria-label="breadcrumb">
              <Link
                underline="hover"
                color="#ddd"
                href="/tracks"
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: '#EE1E50' }
                }}
              >
                Tracks
              </Link>
              <Link
                underline="hover"
                color="#ddd"
                href={`/tracks/${trackSlug}`}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: '#EE1E50' }
                }}
              >
                {eventData.trackName}
              </Link>
              <Typography color="#fff">{eventData.title}</Typography>
            </Breadcrumbs>

            {/* <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }} aria-label="breadcrumb">
          <Link
            underline="hover"
            color="#ddd"
            href="/tracks"
            sx={{ cursor: 'pointer', '&:hover': { color: '#EE1E50' } }}
          >
            Tracks  
          </Link>
          <Link
            underline="hover"
            color="#ddd"
            href={`/tracks/${trackSlug}`}
            sx={{ cursor: 'pointer', '&:hover': { color: '#EE1E50' } }}
          >
            {eventData.trackName}
          </Link>
          <Typography color="#bbbfff">{eventData.title}</Typography>
        </Breadcrumbs> */}
          </div>

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
                        mb: 2
                      },
                      '& h1, & h2, & h3, & h4, & h5, & h6': {
                        fontWeight: 600,
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
  );
}
