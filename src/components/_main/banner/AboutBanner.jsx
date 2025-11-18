import React from 'react';
import { Container, Typography } from '@mui/material';

const AboutBanner = () => {
  return (
    <div
      className="position-relative d-flex align-items-center justify-content-center text-white"
      style={{
        height: '300px'
      }}
    >
      {/* Image */}
      <img
        src="images/about-us-banner.jpg"
        alt="Motorsport photography banner showcasing global track-day images for the LapSnaps About page."
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          top: 0,
          left: 0,
          zIndex: 0
        }}
      />

      {/* Dark gradient overlay */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
          zIndex: 1
        }}
      />

      {/* Text content */}
      <div className="text-center position-relative" style={{ zIndex: 2 }}>
        <Typography
          component="h1"
          variant="h1"
          sx={{
            fontWeight: 600,
            fontSize: {
              xs: '28px',
              md: '30px'
            },
            marginTop: '20px',
            marginBottom: '10px',
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'left'
          }}
        >
          About LapSnaps
        </Typography>
      </div>
    </div>
  );
};

export default AboutBanner;
