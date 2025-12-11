import { Box, Container, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';

export default function TrackBanner({ track }) {
  // Safe data access with fallbacks
  const trackName = track.name || 'Unknown Track';
  const trackCity = track.city || 'Unknown City';
  const trackCountry = track.country || 'Unknown Country';
  const trackLength = track.length || 'N/A';
  const trackCorners = track.corners || 'N/A';

  // Image URLs with fallbacks
  const defaultBannerUrl =
    'https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,f_jpg,h_465,q_65,w_640/v1/crm/virginia/25RIC2CJ_07968_DC74D7F8-03B1-4525-AEB8CE9364DD4AFA_2f960371-6458-4eac-8ba0591de4c5f106.jpg';
  const bannerImage = track.bannerImage?.url || track.thumbnailImage?.url || defaultBannerUrl;
  const logoImage = track.logo?.url || null;

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 300, sm: 400, md: 500 },
        overflow: 'hidden',
        mt: 0
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: {
            xs: '-10px', // mobile
            sm: 10, // tablet
            md: 10 // desktop
          },
          left: 0,
          zIndex: 100
        }}
      >
        <Container maxWidth="xl" sx={{ pt: 3 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <MuiLink underline="hover" color="#bbb" href="/" sx={{ cursor: 'pointer' }}>
              Home
            </MuiLink>
            <MuiLink underline="hover" color="#bbb" href="/tracks" sx={{ cursor: 'pointer' }}>
              Tracks
            </MuiLink>
            <Typography color="#fff">{trackName}</Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <img
          src={bannerImage}
          alt={`${trackName} - ${trackCity}, ${trackCountry}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.8
          }}
        />
      </Box>

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
        {logoImage && (
          <Box
            sx={{
              width: { xs: 50, sm: 120, md: 140 },
              height: { xs: 50, sm: 120, md: 140 },
              margin: '0 auto 20px',
              bgcolor: 'white',
              borderRadius: '50%',
              p: 1,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <img
              src={logoImage}
              alt={`${trackName} logo`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>
        )}

        <h1
          style={{
            color: 'white',
            fontWeight: 800,
            fontSize: '3rem',
            textShadow: '0 2px 11px rgba(0,0,0,0.5)',
            marginBottom: '8px',
            margin: 0
          }}
        >
          {trackName}
        </h1>

        {/* Location and Track Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
            <LocationOnIcon
              sx={{
                color: 'white',
                fontSize: {
                  xs: '13px',
                  sm: '0.95rem',
                  md: '1.1rem'
                }
              }}
            />
            <Typography
              sx={{
                color: 'white',
                fontSize: {
                  xs: '13px',
                  sm: '0.95rem',
                  md: '1.1rem'
                },
                textAlign: 'center'
              }}
            >
              {trackCity}, {trackCountry}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center', md: 'center' },
              gap: 0.5,
              width: {
                xs: '80%',
                sm: '90%',
                md: '90%'
              },
              justifyContent: 'center'
            }}
          >
            <SpeedIcon
              sx={{
                color: 'white',
                fontSize: {
                  xs: '13px',
                  sm: '0.95rem',
                  md: '1.1rem'
                },
                marginTop: { xs: '3px', sm: '0', md: '0' }
              }}
            />
            <Typography
              sx={{
                color: 'white',
                fontSize: {
                  xs: '13px',
                  sm: '0.95rem',
                  md: '1.1rem'
                },
                textAlign: 'center'
              }}
            >
              {trackLength} • {trackCorners} Corners
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
