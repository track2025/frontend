// components/HeroBanner.js
import React from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { Box, Typography, Container } from '@mui/material';
import BreadcrumbLink from 'src/components/BreadcrumbLink';

const HeroBanner = ({
  backgroundImage,
  breadcrumbs,
  title,
  subtitle,
  height = '300px',
  overlay = true,
  breadcrumbPosition = 'top-left'
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: height,
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
        src={backgroundImage}
        alt={title || 'Banner image'}
        fill
        priority
        style={{
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />

      {/* Gradient Overlay - Same as original */}
      {overlay && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3))',
            zIndex: 1
          }}
        />
      )}

      {/* Custom Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: breadcrumbPosition.includes('top') ? 16 : 'auto',
            bottom: breadcrumbPosition.includes('bottom') ? 16 : 'auto',
            left: breadcrumbPosition.includes('left') ? 16 : 'auto',
            right: breadcrumbPosition.includes('right') ? 16 : 'auto',
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
      )}

      {/* Main Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          px: 2,
          maxWidth: '800px'
        }}
      >
        {title && (
          <Typography
            component="h1"
            variant="h1"
            sx={{
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 'bold',
              mb: subtitle ? 2 : 0,
              lineHeight: 1.2
            }}
          >
            {title}
          </Typography>
        )}

        {subtitle && (
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
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

HeroBanner.propTypes = {
  backgroundImage: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string
    })
  ),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  overlay: PropTypes.bool,
  breadcrumbPosition: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right'])
};

export default HeroBanner;
