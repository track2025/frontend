'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Divider,
  Chip,
  Breadcrumbs,
  Link
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import tracksData from '../../../../data/tracks.json';
import eventsData from '../../../../data/events.json';

const TrackDetailsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  const track = tracksData.find((t) => t.slug === slug) || tracksData[0];

  const upcomingEvents = eventsData.filter((e) => e.trackSlug === track.slug).slice(0, 3);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `https://lapsnaps.com/tracks/${track.slug}`,
    name: track.name,
    description: track.fullDescription,
    url: `https://lapsnaps.com/tracks/${track.slug}`,
    image: track.bannerImage,
    address: {
      '@type': 'PostalAddress',
      streetAddress: track.address,
      addressLocality: track.city,
      addressRegion: track.region,
      addressCountry: track.country
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: track.latitude,
      longitude: track.longitude
    },
    telephone: track.phone,
    email: track.email,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: track.rating,
      reviewCount: track.reviewCount,
      bestRating: 5
    },
    // amenityFeature: track.facilities.map((facility) => ({
    //   '@type': 'LocationFeatureSpecification',
    //   name: facility
    // })),
    sameAs: [
      track.website,
      `https://facebook.com/${track.socialMedia.facebook}`,
      `https://instagram.com/${track.socialMedia.instagram}`,
      `https://twitter.com/${track.socialMedia.twitter}`
    ]
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: track.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  const breadcrumbStructuredData = {
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
        name: 'Tracks',
        item: 'https://lapsnaps.com/tracks'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: track.name,
        item: `https://lapsnaps.com/tracks/${track.slug}`
      }
    ]
  };

  return (
    <>
      <title>{track.metaTitle}</title>
      <meta name="description" content={track.metaDescription} />
      <meta name="keywords" content={track.keywords.join(', ')} />
      <link rel="canonical" href={`https://lapsnaps.com/tracks/${track.slug}`} />

      <meta property="og:title" content={track.metaTitle} />
      <meta property="og:description" content={track.metaDescription} />
      <meta property="og:url" content={`https://lapsnaps.com/tracks/${track.slug}`} />
      <meta property="og:type" content="place" />
      <meta property="og:image" content={track.bannerImage} />
      <meta property="place:location:latitude" content={track.latitude} />
      <meta property="place:location:longitude" content={track.longitude} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={track.metaTitle} />
      <meta name="twitter:description" content={track.metaDescription} />
      <meta name="twitter:image" content={track.bannerImage} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
        {/* Breadcrumbs */}
        <Container maxWidth="xl" sx={{ pt: 3 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/" sx={{ cursor: 'pointer' }}>
              Home
            </Link>
            <Link underline="hover" color="inherit" href="/tracks" sx={{ cursor: 'pointer' }}>
              Tracks
            </Link>
            <Typography color="text.primary">{track.name}</Typography>
          </Breadcrumbs>
        </Container>

        {/* Banner Section */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: 300, sm: 400, md: 500 },
            bgcolor: '#000',
            overflow: 'hidden',
            mt: 2
          }}
        >
          <Box
            component="img"
            src={track.bannerImage}
            alt={`${track.name} - ${track.city}, ${track.country}`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.8
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%)'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              px: 2
            }}
          >
            <Box
              sx={{
                width: { xs: 100, sm: 120, md: 140 },
                height: { xs: 100, sm: 120, md: 140 },
                margin: '0 auto 20px',
                bgcolor: 'white',
                borderRadius: '50%',
                p: 2,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box
                component="img"
                src={track.logo}
                alt={`${track.name} logo`}
                sx={{
                  width: '85%',
                  height: '85%',
                  objectFit: 'contain'
                }}
              />
            </Box>
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                fontWeight: 800,
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                mb: 1
              }}
            >
              {track.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnIcon sx={{ color: 'white', fontSize: 20 }} />
                <Typography sx={{ color: 'white', fontSize: '1.1rem' }}>
                  {track.city}, {track.country}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <SpeedIcon sx={{ color: 'white', fontSize: 20 }} />
                <Typography sx={{ color: 'white', fontSize: '1.1rem' }}>
                  {track.length} • {track.corners} Corners
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
          {/* Description */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 700,
                color: '#1a1a1a',
                mb: 2
              }}
            >
              About {track.name}
            </Typography>
            <Typography
              sx={{
                fontSize: '16px',
                lineHeight: 1.7,
                color: '#333',
                mb: 2
              }}
            >
              {track.fullDescription}
            </Typography>
          </Box>

          {/* Two Column Grid */}
          <Grid container spacing={4}>
            {/* Left Column - Gallery & Search */}
            <Grid item size={{ xs: 12, lg: 8 }}>
              {/* Search Section - Sticky */}
              <Box
                sx={{
                  mb: 4,
                  position: { lg: 'sticky' },
                  top: { lg: 76 },
                  zIndex: 10,
                  bgcolor: '#f8f9fa',
                  py: 2
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#1a1a1a',
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    mb: 2
                  }}
                >
                  Track Gallery
                </Typography>
                <TextField
                  placeholder="Search photos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  sx={{
                    width: { xs: '100%', sm: 300 },
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: '#ddd'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#EE1E50'
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#666' }} />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              {/* Gallery Grid - Consistent Image Sizes */}
              <Grid container spacing={3}>
                {track.gallery.map((image, index) => (
                  <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 2,
                        boxShadow: 2,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 28px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          height: 200,
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        <Box
                          component="img"
                          src={image}
                          alt={`${track.name} Gallery ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                      </Box>
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            fontSize: '0.875rem',
                            textAlign: 'center'
                          }}
                        >
                          Photo {index + 1}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Right Column - Events */}
            <Grid item size={{ xs: 12, lg: 4 }}>
              <Card
                sx={{
                  bgcolor: 'white',
                  boxShadow: 3,
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  position: { lg: 'sticky' },
                  top: { lg: 80 }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <EventIcon sx={{ color: '#EE1E50', fontSize: 28 }} />
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        color: '#1a1a1a'
                      }}
                    >
                      Upcoming Events
                    </Typography>
                  </Box>

                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event, index) => (
                      <Box key={event.id}>
                        <Box
                          onClick={() => router.push(`/tracks/${track.slug}/events/${event.slug}`)}
                          sx={{
                            py: 2.5,
                            px: 1,
                            cursor: 'pointer',
                            borderRadius: 1,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: '#f8f9fa',
                              transform: 'translateX(4px)'
                            }
                          }}
                        >
                          <Chip
                            label={event.category}
                            size="small"
                            sx={{
                              bgcolor: '#EE1E50',
                              color: 'white',
                              fontWeight: 600,
                              mb: 1.5
                            }}
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              mb: 1.5,
                              fontSize: '1rem',
                              lineHeight: 1.3
                            }}
                          >
                            {event.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                              {formatDate(event.date)}
                            </Typography>
                          </Box>
                        </Box>
                        {index < upcomingEvents.length - 1 && (
                          <Divider
                            sx={{
                              borderColor: '#e0e0e0',
                              my: 1
                            }}
                          />
                        )}
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        No upcoming events scheduled
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        Check back later for new events
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* FAQ Section */}
          <Box sx={{ mt: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 6,
                color: '#1a1a1a',
                textAlign: 'center',
                fontSize: { xs: '1.75rem', md: '2.25rem' }
              }}
            >
              Frequently Asked Questions
            </Typography>

            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              {track.faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  sx={{
                    mb: 2,
                    bgcolor: 'white',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    borderRadius: '12px !important',
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#EE1E50' }} />}
                    sx={{
                      py: 2,
                      px: 3
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '1.1rem' }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ bgcolor: '#fafafa', px: 3, py: 3 }}>
                    <Typography sx={{ color: '#555', lineHeight: 1.7, fontSize: '1rem' }}>{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TrackDetailsPage;
