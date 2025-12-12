import { Box, Container, Typography } from '@mui/material';

/**
 * Server component for rendering track description (About section)
 * This is rendered on the server for SEO benefits
 */
export default function TrackDescription({ track }) {
  const trackName = track?.name || 'this track';
  const trackDescription = track?.fullDescription || track?.description || 'No description available.';

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 7, md: 6 }, px: { xs: 4, md: 7 } }}>
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '1.5rem', md: '1.75rem' },
            fontWeight: 700,
            mb: 2,
            color: 'text.primary'
          }}
        >
          About {trackName}
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            lineHeight: 1.7,
            mb: 2,
            whiteSpace: 'pre-line',
            color: 'text.primary'
          }}
        >
          {trackDescription}
        </Typography>
      </Box>
    </Container>
  );
}
