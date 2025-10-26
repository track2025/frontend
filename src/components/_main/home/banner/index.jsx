'use client';
import React from 'react';
import Link from 'next/link';
// mui
import { Box, Typography, Grid, Button, Container, Stack } from '@mui/material';
// icons
import { IoIosArrowForward } from 'react-icons/io';

// blur image
import bannerImg from '../../../../../public/images/race-track.webp';
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
          py: 8,
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
                <Typography
                  sx={{ zIndex: 11, color: '#fff' }}
                  className="col-md-6"
                  variant="h2"
                  fontWeight={900}
                >
                  The Marketplace for <br className="d-md-block d-none" /> Race Track Car Media
                </Typography>

                <Typography
                  className="col-md-6"
                  sx={{ zIndex: 11, color: '#fff', fontSize: '18px' }}
                  variant="body1"
                >
                  Welcome to our world of photography and videography excellence, where race moments become timeless statements of passion.
                  Our collection showcases an unparalleled selection of premium car pictures and videos, curated from renowned race track photographers around the globe.
                </Typography>

                <Box>
                  <Button
                    component={Link}
                    href="/products?top=1"
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
                    Explore the Collection
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
