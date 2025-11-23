import React from 'react';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';

const AboutBanner = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '300px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        overflow: 'hidden'
      }}
    >
      {/* Background Image with Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay
          zIndex: 1
        }}
      />

      {/* Next.js Image Component */}
      <Image
        src="/images/about-us-banner.jpg"
        alt="LapSnaps About Us - Professional Motorsport Photography Services"
        fill
        priority
        style={{
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />

      {/* Content */}
      <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                textAlign: 'center',
                px: 2
              }}
            >
              <Typography
                component="h1"
                variant="h1"
                sx={{
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 'bold',
                  mb: 2,
                  lineHeight: 1.2
                }}
              >
               About LapSnaps – The Motorsport Photography Platform
              </Typography>
              <Typography
                component="h2"
                variant="h2"
                sx={{
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  mb: 2,
                  lineHeight: 1.4,
                  fontWeight: 400,
                  opacity: 0.9
                }}
              >
                Buy, browse, and download track-day photos from circuits worldwide
              </Typography>
            </Box>
    </Box>
  );
};

export default AboutBanner;
