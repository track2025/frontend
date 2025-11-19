import React from 'react';
import Image from 'next/image';
import { Box, Typography, Container } from '@mui/material';

const Banner = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '400px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        overflow: 'hidden'
      }}
    >
      {/* Background Image */}
      <Image
        src="/images/store-banner.jpg"
        alt="Track-Day Racing Gear & Motorsport Equipment - Premium helmets, racewear, pit gear, and accessories for track-day drivers and racers"
        fill
        priority
        style={{
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />

      {/* Gradient Overlay - Same as original */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
          zIndex: 1
        }}
      />

      {/* Content */}
      <Container maxWidth="xl">
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: { xs: 'center', md: 'left' },
            px: { xs: 2, md: 5 }
          }}
        >
          <Typography
            component="h1"
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 'bold',
              mb: 2,
              lineHeight: 1.2
            }}
          >
            Track-Day Racing Gear & Motorsport Equipment
          </Typography>

          <Typography
            component="h2"
            variant="h2"
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
              fontWeight: 400, // Normal weight instead of bold
              lineHeight: 1.5,
              maxWidth: '600px',
              mx: { xs: 'auto', md: 0 },
              opacity: 0.9, // Slightly transparent for softer look
              fontStyle: 'normal', // Ensure no italics
              textShadow: '0 1px 2px rgba(0,0,0,0.3)' // Soft text shadow for better readability
            }}
          >
            Premium helmets, racewear, pit gear, and accessories for track-day drivers and racers.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Banner;
