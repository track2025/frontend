'use client';
import React from 'react';
import Link from 'src/utils/link';
// mui
import { alpha } from '@mui/material/styles';
import { Box, Typography, Grid, Button, Container, Stack } from '@mui/material';
// blur image
import Image from 'next/image';
import { IoIosArrowForward } from 'react-icons/io';
import bannerImg from '../../../../../public/images/banner-3.png';
import BlurImage from 'src/components/blurImage';

export default function Banner() {
  return (
    <Box
      sx={{
        mt: 4,
        overflow: 'hidden',
        position: 'relative',
        display: { md: 'block', xs: 'none' },
        '&:before': {
          content: "''",
          position: 'absolute',
          bottom: '-40px',
          left: 100,
          bgcolor: (theme) => alpha(theme.palette.success.light, 0.77),
          height: 80,
          width: 80,
          borderRadius: '50px',
          zIndex: 0
        }
      }}
    >
      <Box
        key={Math.random()}
        sx={{
          mt: 3,

          py: 12,
          position: 'relative'
        }}
      >
        <BlurImage src={bannerImg} alt="banner-3" placeholder="blur" layout="fill" sizes="100vw" />
        <Container fixed>
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={6} md={6}>
              <Stack spacing={2}>
                <Typography sx={{ zIndex: 11 }} variant="h2" fontWeight={900}>
                  UK Premier Store for Wrist Watches
                </Typography>
                <Typography sx={{ zIndex: 11 }} variant="body1" color="text.success">
                  Welcome to our world of horological excellence, where timepieces become timeless statements of
                  elegance. Our collection showcases an unparalleled selection of premium watches, curated from renowned
                  luxury brands around the globe.
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
                      borderRadius: 6
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
