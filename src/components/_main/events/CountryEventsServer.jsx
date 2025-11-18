import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Grid,
  Card,
  CardContent,
  Chip,
  CardActionArea
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getCountryFlag } from 'src/utils/flags';

export default function CountryEventsServer({ countryEvents, countryInfo, countrySlug }) {
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

  return (
    <Box sx={{ py: { xs: 3, md: 1 } }}>
      <Container maxWidth="xl" style={{ position: 'relative' }}>
        <Box style={{ position: 'absolute', top: 8, left: 20 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3.5 }} aria-label="breadcrumb">
            <MuiLink underline="hover" color="inherit" href="/events" sx={{ cursor: 'pointer' }}>
              Events
            </MuiLink>
            {countryInfo?.country == 'this country' ? (
              <Typography color="text.primary">{countryInfo.countrySlug.toUpperCase()}</Typography>
            ) : (
              <Typography color="text.primary">{countryInfo.country}</Typography>
            )}
          </Breadcrumbs>
        </Box>

        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 2,
            boxShadow: 2
          }}
        >
          <Typography sx={{ fontSize: '4rem', mb: 2, lineHeight: 1 }}>
            {getCountryFlag(countryInfo.countryCode || countrySlug)}
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' },
              fontWeight: 800,
              mb: 1
            }}
          >
            Motorsport Events in {countryInfo.country}
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              fontWeight: 400,
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

        {countryEvents.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h4" sx={{ color: '#666', mb: 2 }}>
              No Upcoming Events
            </Typography>
            <Typography variant="body1" sx={{ color: '#999', mb: 3 }}>
              There are currently no upcoming events in {countryInfo.country}.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {countryEvents.map((event) => (
              <Grid item size={12} key={event._id}>
                <Card sx={{ boxShadow: 1, overflow: 'hidden' }}>
                  <CardActionArea component={Link} href={`/tracks/${event.trackSlug}/events/${event.slug}`}>
                    <CardContent sx={{ p: 0 }}>
                      <Grid container spacing={0}>
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
                              src={event.image?.url || event.thumbnailImage}
                              alt={event.title}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                            />
                          </Box>
                        </Grid>

                        <Grid item size={{ xs: 12, sm: 9, md: 9 }}>
                          <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
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

                            <Typography
                              variant="h3"
                              sx={{
                                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                fontWeight: 700,
                                mb: 1.5,
                                lineHeight: 1.3
                              }}
                            >
                              {event.title}
                            </Typography>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 2.5 }, mb: 1.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <CalendarTodayIcon sx={{ fontSize: 18 }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {formatDate(event.date)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <AccessTimeIcon sx={{ fontSize: 18 }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {formatTimeRange(event.startTime, event.endTime)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <LocationOnIcon sx={{ fontSize: 18 }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {event.trackName}
                                </Typography>
                              </Box>
                            </Box>

                            <Typography
                              variant="body2"
                              sx={{
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
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
