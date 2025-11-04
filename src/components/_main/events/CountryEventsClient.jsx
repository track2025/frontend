'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
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
  Button,
  CardActionArea,
  TextField,
  InputAdornment,
  IconButton,
  Paper
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { getCountryFlag } from 'src/utils/flags';

export default function CountryEventsClient({ countryEvents, countryInfo, countrySlug }) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(countryEvents);
  const debounceRef = useRef(null);

  // Get search term from URL on component mount
  useEffect(() => {
    const searchFromUrl = searchParams.get('search') || '';
    setSearchTerm(searchFromUrl);
  }, [searchParams]);

  // Filter events when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEvents(countryEvents);
    } else {
      const searchLower = searchTerm.toLowerCase().trim();
      const filtered = countryEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchLower) ||
          event.trackName.toLowerCase().includes(searchLower) ||
          event.city.toLowerCase().includes(searchLower) ||
          // event.type.toLowerCase().includes(searchLower) ||
          event.category.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower)
      );
      setFilteredEvents(filtered);
    }
  }, [searchTerm, countryEvents]);

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
      'Open Track': '#0288d1',
      Drift: '#7b1fa2'
    };
    return colors[type] || '#666';
  };

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce to update URL after typing stops
    debounceRef.current = setTimeout(() => {
      updateUrl(newSearchTerm);
    }, 300); // 300ms debounce
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    updateUrl('');

    // Clear debounce if any
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  };

  const updateUrl = (search) => {
    const params = new URLSearchParams();
    if (search.trim()) {
      params.set('search', search.trim());
    }
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', newUrl);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <>
      <Box sx={{ /*minHeight: '100vh',*/ py: { xs: 3, md: 1 } }}>
        <Container maxWidth="xl" style={{
          position: 'relative'
        }}>
          {/* Breadcrumbs */}
        <div style={{
          // marginBottom: -20
          position: 'absolute',
          top: 8,
          left: 20
        }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3.5 }} aria-label="breadcrumb">
            <MuiLink
              underline="hover"
              color="inherit"
              href="/events"
              sx={{ cursor: 'pointer', '&:hover': { color: '#EE1E50' } }}
            >
              Events
            </MuiLink>
            {countryInfo?.country == 'this country' ? (
              <Typography color="text.primary">{countryInfo.countrySlug.toUpperCase()}</Typography>
            ) : (
              <Typography color="text.primary">{countryInfo.country}</Typography>
            )}
          </Breadcrumbs>
        </div>

          {/* Header with Flag */}
          <Box
            sx={{
              textAlign: 'center',
              mb: 4,
              p: { xs: 3, md: 4 },
              // bgcolor: 'white',
              borderRadius: 2,
              boxShadow: 2
              // background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
            }}
          >
            <Typography sx={{ fontSize: '4rem', mb: 2, lineHeight: 1 }}>
              {getCountryFlag(countryInfo.countryCode || countrySlug)}
            </Typography>

            {/* H1 Heading */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' },
                fontWeight: 800,
                // color: '#1a1a1a',
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
                // color: '#666',
                mb: 2
              }}
            >
              Upcoming car & bike track days and racing events
            </Typography>

            <Chip
              label={`${filteredEvents.length} Upcoming Events${searchTerm ? ` for "${searchTerm}"` : ''}`}
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

          {/* Search Bar */}
          <Paper
            sx={{
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              // p: 1,
              borderRadius: '28px', // Fully rounded corners
              background: 'transparent'
            }}
          >
            <TextField
              fullWidth
              placeholder="Search events by title, track, or city..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton aria-label="clear search" onClick={handleClearSearch} edge="end" size="small">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '24px' // Fully rounded corners for the input
                }
              }}
            />
          </Paper>

          {/* Events List */}
          {filteredEvents.length === 0 ? (
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
                {searchTerm ? 'No Events Found' : 'No Upcoming Events'}
              </Typography>
              <Typography variant="body1" sx={{ color: '#999', mb: 3 }}>
                {searchTerm
                  ? `No events found matching "${searchTerm}" in ${countryInfo.country}.`
                  : `There are currently no upcoming events in ${countryInfo.country}.`}
              </Typography>
              {searchTerm && (
                <Button variant="outlined" onClick={handleClearSearch} sx={{ mr: 2 }}>
                  Clear Search
                </Button>
              )}
              <Button
                variant="contained"
                component={Link}
                href="/events"
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
              {filteredEvents.map((event, index) => (
                <Grid item size={12} key={event.id}>
                  <Card
                    sx={{
                      boxShadow: 1,
                      transition: 'all 0.2s ease',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.12)'
                      }
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      href={`/tracks/${event.trackSlug}/events/${event.slug}`}
                      sx={{ display: 'block' }}
                    >
                      <CardContent sx={{ p: 0 }}>
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
                                src={event.image?.url || event.thumbnailImage}
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
                                {/* <Chip
                                  label={event.type || 'Track Event'}
                                  size="small"
                                  sx={{
                                    bgcolor: getEventTypeColor(event.type),
                                    color: 'white',
                                    fontWeight: 600,
                                    height: 24
                                  }}
                                /> */}
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
                                  // color: '#1a1a1a',
                                  mb: 1.5,
                                  lineHeight: 1.3
                                }}
                              >
                                {event.title}
                              </Typography>

                              {/* Event Details */}
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

                              {/* Event Description */}
                              <Typography
                                variant="body2"
                                sx={{
                                  // color: '#555',
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
    </>
  );
}
