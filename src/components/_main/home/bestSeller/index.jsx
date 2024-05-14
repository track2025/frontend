'use client';
// react
import React from 'react';
// mui
import { Typography, Box, Stack, Button } from '@mui/material';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
// components
import ProductsCarousel from 'src/components/carousels/products';
import { IoIosArrowForward } from 'react-icons/io';
// next
import NextLink from 'src/utils/link';

export default function Featured() {
  const { data, isLoading } = useQuery(['get-best-products'], () => api.getBestSellingProducts());
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h2" color="text.primary" mt={{ xs: 5, md: 8 }}>
            New Arrivals
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={5}>
            Special products in this month
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
          href={``}
        >
          View More
        </Button>
      </Stack>

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
