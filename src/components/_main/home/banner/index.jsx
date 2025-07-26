'use client';
import React from 'react';
import Link from 'next/link';
// mui
import { Box, Typography, Grid, Button, Container, Stack } from '@mui/material';
// icons
import { IoIosArrowForward } from 'react-icons/io';

// blur image
import bannerImg from '../../../../../public/images/banner-33.png';
// components
import BlurImage from 'src/components/blurImage';

export default function Banner() {
  return (
    <Box
      sx={{
        mt: 4,
        overflow: 'hidden',
        position: 'relative',
        display: { md: 'block', xs: 'none' }
      }}
    >
      <Box
        sx={{
          mt: 3,
          py: 12,
          position: 'relative'
        }}
      >
        <BlurImage
          src={bannerImg}
          alt="banner-3"
          placeholder="blur"
          layout="fill"
          static
          sizes="800px"
          objectFit="cover"
        />
        <Container maxWidth="xl">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={6} md={6}>
              <Stack spacing={2}>
                <Typography sx={{ zIndex: 11, color:'#000' }} className='col-md-6' variant="h2" fontWeight={900}>
                The Marketplace for <br className='d-md-block d-none'></br> Race Track Car Media
                </Typography>
                <Typography className='col-md-6' sx={{ zIndex: 11, color:'#000', fontSize: '18px' }} variant="body1" color="text.success">
                  Welcome to our world of Photography and Videography excellence, where timepieces become timeless statements of
                  elegance. Our collection showcases an unparalleled selection of premium car pictures and vides, curated from renowned
                  Race track Photographers around the globe.
                </Typography>
                <Box>
                  <Button
                    component={Link}
                    href="/products"
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<IoIosArrowForward />}
                    sx={{
                      bgcolor: '#000000',       // black background
                      color: '#ffffff',         // white text
                      borderRadius: 6,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#1a1a1a',     // remain black on hover
                        opacity: 0.9            // subtle hover effect
                      }
                    }}
                  >
                    View more
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
