'use client';
// react
import React from 'react';
// mui
import { Typography, Box } from '@mui/material';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
// components
import ProductsCarousel from 'src/components/carousels/products';

export default function Featured() {
  const { data, isLoading } = useQuery(['get-best-products'], () => api.getBestSellingProducts());
  return (
    <Box>
      <Typography variant="h2" color="text.primary" textAlign="center" mt={8}>
        Best Seller
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" mb={5}>
        Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.
      </Typography>

      {!isLoading && !Boolean(data?.data.length) ? (
        <Typography variant="h3" color="error.main" textAlign="center">
          Products not found
        </Typography>
      ) : (
        <ProductsCarousel data={data?.data} isLoading={isLoading} />
      )}
    </Box>
  );
}
