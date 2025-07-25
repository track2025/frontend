'use client';

import React from 'react';
import NextLink from 'next/link';

// mui
import { Typography, Box, Button, Stack } from '@mui/material';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
// components
import ProductsCarousel from 'src/components/carousels/gridSlider';
// icons
import { IoIosArrowForward } from 'react-icons/io';
export default function Index() {
  const { data, isLoading } = useQuery(['featured-products'], () => api.getFeaturedProducts());

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        textAlign={{ xs: 'center', md: 'left' }}
      >
        <Box>
          <Typography variant="h2" color="text.primary" mt={{ xs: 4, md: 8 }}>
          Featured Photos
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={{ xs: 3, md: 5 }}>
          A curated collection of standout images that capture beauty, emotion, and storytelling at a glance. Explore the shots that define our visual style and celebrate creativity in every frame.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="#000000"
          size="large"
          sx={{
            borderRadius: 6,
            display: { xs: 'none', md: 'flex' },
            minWidth: 130,
            px: 1
          }}
          endIcon={<IoIosArrowForward />}
          component={NextLink}
          href={`/products?featured=true`}
        >
          View More
        </Button>
      </Stack>

      {!isLoading && !Boolean(data?.data.length) ? (
        <Typography variant="h3" color="error.main" textAlign="center">
          Products not found
        </Typography>
      ) : (
        <ProductsCarousel data={data?.data || []} isLoading={isLoading} />
      )}
      <Button
        variant="text"
        color="#000000"
        size="small"
        sx={{
          borderRadius: 6,
          mx: 'auto',
          display: { md: 'none', xs: 'flex' },
          maxWidth: '120px'
        }}
        endIcon={<IoIosArrowForward />}
        component={NextLink}
        href={`/categories`}
      >
        View More
      </Button>
    </Box>
  );
}
