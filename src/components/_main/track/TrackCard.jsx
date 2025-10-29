'use client';
import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';

export const TrackCard = ({ track, onClick }) => {
  // Default banner URL
  const defaultBannerUrl =
    'https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,f_jpg,h_465,q_65,w_640/v1/crm/virginia/25RIC2CJ_07968_DC74D7F8-03B1-4525-AEB8CE9364DD4AFA_2f960371-6458-4eac-8ba0591de4c5f106.jpg';

  // Safe data access with fallbacks
  const trackName = track.name || 'Unknown Track';
  const trackCity = track.city || 'Unknown City';
  const trackCountry = track.country || 'Unknown Country';
  const trackCountryCode = track.countryCode || '??';
  const trackLength = track.length || null;
  const trackCorners = track.corners || null;
  const trackFacilities = track.facilities || [];

  // Image URLs with fallbacks
  const thumbnailImage = track.thumbnailImage?.url || track.bannerImage?.url || defaultBannerUrl;
  const logoImage = track.logo?.url || null;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 32px rgba(238, 30, 80, 0.2)'
        }
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          p: 0
        }}
      >
        {/* Image Container with Logo Overlay */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 200,
            overflow: 'hidden'
          }}
        >
          {/* Main Track Image */}
          <Box
            component="img"
            src={thumbnailImage}
            alt={`${trackName} - ${trackCity}, ${trackCountry}`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
            onError={(e) => {
              // If image fails to load, use default
              e.target.src = defaultBannerUrl;
            }}
          />

          {/* Logo Overlay - Only show if logo exists */}
          {logoImage && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                width: 50,
                height: 50,
                bgcolor: 'white',
                borderRadius: '50%',
                p: 0.5,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #fff'
              }}
            >
              <Box
                component="img"
                src={logoImage}
                alt={`${trackName} logo`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '50%'
                }}
                onError={(e) => {
                  // Hide logo container if logo fails to load
                  e.target.style.display = 'none';
                  e.target.parentElement.style.display = 'none';
                }}
              />
            </Box>
          )}

          {/* Country Flag/Info Overlay */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              bgcolor: 'rgba(0,0,0,0.8)',
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
              textTransform: 'uppercase'
            }}
          >
            {trackCountryCode}
          </Box>
        </Box>

        {/* Card Content - Compact */}
        <CardContent
          sx={{
            p: 2,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          {/* Track Name */}
          <Typography
            variant="h3"
            sx={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#1a1a1a',
              textAlign: 'center',
              mb: 0.5,
              lineHeight: 1.3,
              minHeight: '2.6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {trackName}
          </Typography>

          {/* Location */}
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              textAlign: 'center',
              fontSize: '0.85rem',
              mb: 1,
              minHeight: '1.2rem'
            }}
          >
            {trackCity}, {trackCountry}
          </Typography>

          {/* Track Info - Only show if data exists */}
          {(trackLength || trackCorners) && (
            <Box sx={{ textAlign: 'center', mb: 1 }}>
              {trackLength && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#EE1E50',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    mb: 0.5
                  }}
                >
                  {trackLength}
                </Typography>
              )}
              {trackCorners && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#666',
                    fontSize: '0.75rem'
                  }}
                >
                  {trackCorners} Corners
                </Typography>
              )}
            </Box>
          )}

          {/* Facilities - Only show if facilities exist */}
          {trackFacilities.length > 0 && (
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#999',
                  fontSize: '0.7rem',
                  display: 'block',
                  lineHeight: 1.2
                }}
              >
                {trackFacilities.slice(0, 2).join(', ')}
                {trackFacilities.length > 2 && '...'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
