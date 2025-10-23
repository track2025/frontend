'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const trackData = {
  slug: 'silverstone-circuit',
  name: 'Silverstone Circuit',
  bannerImage:
    'https://media.istockphoto.com/id/1136509478/photo/two-cars-drifting-battle-on-race-track-with-smoke-aerial-view-two-car-drifting-battle.jpg?s=612x612&w=0&k=20&c=-Dc8OdIz_CeETylIY268ZLHf9gbrts1sv59GERcvZ2w=',
  logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWbhIE5zlB65lhf7uOFjAEeGi0-70ycKyCNg&s',
  description: `<p>Silverstone Circuit is a motor racing circuit in England, near the Northamptonshire villages of Silverstone and Whittlebury. It is the home of the British Grand Prix, which it first hosted as the 1948 British Grand Prix.</p>`,

  gallery: [
    'https://thumbs.dreamstime.com/b/high-speed-snow-rally-car-icy-track-dynamic-racing-snowy-terrain-motion-blur-capturing-extreme-winter-sports-377286169.jpg',
    'https://thumbs.dreamstime.com/b/car-driving-down-wet-road-lights-side-sports-race-360062315.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2vPEYyTZbJ965W1n-5QaoWWTACCQ9BEhdpw&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCSugXOZ0SYGTmeCpxfZu31iu1R1Nv5z5P7g&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXtWH3Oqo3ZN-owHLL-4TrdAVIUchtRbkTcA&s',
    'https://images.pexels.com/photos/28944067/pexels-photo-28944067/free-photo-of-high-speed-racing-car-on-track-mid-action.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  ],

  upcomingEvents: [
    {
      id: 1,
      slug: 'british-grand-prix',
      title: 'British Grand Prix',
      date: '2025-07-06',
      series: 'Formula 1'
    },
    {
      id: 2,
      slug: 'silverstone-classic',
      title: 'Silverstone Classic',
      date: '2025-08-22',
      series: 'Historic Racing'
    },
    {
      id: 3,
      slug: 'motogp-british-grand-prix',
      title: 'MotoGP British Grand Prix',
      date: '2025-08-30',
      series: 'MotoGP'
    },
    {
      id: 4,
      slug: 'wtcr-race-of-uk',
      title: 'WTCR Race of UK',
      date: '2025-09-14',
      series: 'World Touring Car'
    },
    {
      id: 5,
      slug: 'british-gt-championship',
      title: 'British GT Championship',
      date: '2025-10-05',
      series: 'GT Racing'
    }
  ],

  faqs: [
    {
      question: 'What is the best way to get to Silverstone Circuit?',
      answer: 'The circuit is easily accessible by road via the M1, M40, and A43.'
    },
    {
      question: 'Can I bring my own food and drinks to the circuit?',
      answer: 'Yes, spectators are welcome to bring their own food and non-alcoholic beverages.'
    }
  ]
};

const TrackDetailsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleEventClick = (eventSlug) => {
    router.push(`/tracks/${trackData.slug}/events/${eventSlug}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Banner Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 300, sm: 400, md: 500 },
          bgcolor: '#000',
          overflow: 'hidden'
        }}
      >
        <Box
          component="img"
          src={trackData.bannerImage}
          alt={trackData.name}
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
            background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)'
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
              src={trackData.logo}
              alt={`${trackData.name} logo`}
              sx={{
                width: '85%',
                height: '85%',
                objectFit: 'contain'
              }}
            />
          </Box>
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            {trackData.name}
          </Typography>
        </Box>
      </Box>

      {/* Main Content - WIDER CONTAINER */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Description - Full Width */}
        <Box sx={{ mb: 6 }}>
          <Box
            dangerouslySetInnerHTML={{ __html: trackData.description }}
            sx={{
              '& p': {
                fontSize: '16px',
                lineHeight: 1.7,
                color: '#333',
                mb: 2
              }
            }}
          />
        </Box>

        {/* Two Column Grid */}
        <Grid container spacing={4}>
          {/* Left Column - Gallery Only */}
          <Grid item size={{ xs: 12, lg: 8, xl: 9 }}>
            {/* Gallery Section */}
            <Box sx={{ mb: 6 }}>
              {/* Gallery Header with Sticky Search */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 4,
                  position: 'sticky',
                  top: 76,
                  bgcolor: '#f8f9fa',
                  py: 2,
                  zIndex: 10
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                  Gallery
                </Typography>
                <TextField
                  placeholder="Search photos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  sx={{
                    width: 280,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
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

              {/* Gallery Grid - FIXED FOR 3 CARDS PER ROW */}
              <Grid container spacing={2}>
                {trackData.gallery.map((image, index) => (
                  <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Box
                      sx={{
                        height: 160,
                        overflow: 'hidden',
                        bgcolor: 'white',
                        borderRadius: 1,
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <Box
                        component="img"
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Right Column - Events */}
          <Grid item size={{ xs: 12, lg: 4, xl: 3 }}>
            <Box
              sx={{
                bgcolor: 'white',
                position: 'sticky',
                top: 80,
                mb: 4
              }}
            >
              <Card
                sx={{
                  bgcolor: 'white',
                  boxShadow: 2,
                  border: '1px solid #e0e0e0',
                  position: 'sticky',
                  top: 80,
                  mb: 4
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <EventIcon sx={{ color: '#EE1E50', fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Upcoming Events
                    </Typography>
                  </Box>

                  {trackData.upcomingEvents.map((event, index) => (
                    <Box key={event.id}>
                      <Box
                        onClick={() => handleEventClick(event.slug)}
                        sx={{
                          py: 2.5,
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
                          label={event.series}
                          size="small"
                          sx={{
                            bgcolor: '#EE1E50',
                            color: 'white',
                            fontWeight: 600,
                            mb: 1
                          }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {event.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarTodayIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            {formatDate(event.date)}
                          </Typography>
                        </Box>
                      </Box>
                      {index < trackData.upcomingEvents.length - 1 && <Divider sx={{ borderColor: '#e0e0e0' }} />}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>

        {/* FAQ Section - Full Width Below Grid */}
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 6,
              color: '#1a1a1a',
              textAlign: 'center',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Frequently Asked Questions
          </Typography>

          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {trackData.faqs.map((faq, index) => (
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
                  <Typography sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '1.1rem' }}>{faq.question}</Typography>
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
  );
};

export default TrackDetailsPage;
