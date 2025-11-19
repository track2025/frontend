import React from 'react';
import Image from 'next/image';
import { Box, Typography, Container } from '@mui/material';
import BreadcrumbLink from 'src/components/BreadcrumbLink';

const CollectionBanner = ({ breadcrumbs }) => {
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
      {/* Background Image */}
      <Image
        src="/images/collection-banner.jpg"
        alt="Explore All Track-Day Photos & Motorsport Images - Search thousands of professionally captured car & bike track-day photos from photographers worldwide"
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

      {/* Custom Breadcrumbs positioned top left */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 2,
          background: 'rgba(0,0,0,0.15)',
          borderRadius: '6px',
          backdropFilter: 'blur(1px)',
          padding: '6px 12px'
        }}
      >
        <Box
          component="nav"
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.9rem'
          }}
        >
          {breadcrumbs.map((crumb, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              {index > 0 && (
                <Typography
                  component="span"
                  sx={{
                    mx: 1,
                    color: 'rgba(255,255,255,0.6)'
                  }}
                >
                  ›
                </Typography>
              )}
              <BreadcrumbLink href={crumb.href} isLast={index === breadcrumbs.length - 1}>
                {crumb.name}
              </BreadcrumbLink>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Main Content */}
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
          Explore All Track-Day Photos & Motorsport Images
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
          Search thousands of professionally captured car & bike track-day photos from photographers worldwide.
        </Typography>
      </Box>
    </Box>
  );
};

export default CollectionBanner;
