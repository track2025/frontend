'use client';
// react
import React from 'react';
// mui
import { Typography, Box, Button, Stack } from '@mui/material';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
// components
import ProductsCarousel from 'src/components/carousels/gridSlider';
import { IoIosArrowForward } from 'react-icons/io';
import NextLink from 'next/link';
export default function Index() {
  const { data, isLoading } = useQuery(['get-best-products'], () => api.getBestSellingProducts());

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h2" color="text.primary" mt={8}>
            Top Collection
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={5}>
            Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            borderRadius: 6
          }}
          endIcon={<IoIosArrowForward />}
          component={NextLink}
          href={`/products?top=1`}
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
    </Box>
  );
}
