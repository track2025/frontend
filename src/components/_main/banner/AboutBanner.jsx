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
          textAlign: 'center'
        }}
      >
        {/* Optional: Add text content here if needed */}
        {/* <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                    About Us
                </Typography>
                <Typography variant="h6">
                    Superior kartwear and equipment designed to shave seconds off your lap times
                </Typography> */}
      </Box>
    </Box>
  );
};

export default AboutBanner;
