'use client';
// react
import React from 'react';
// mui
import { Typography, Box, Button, Stack } from '@mui/material';
// api
// import * as api from 'src/services';
// import { useQuery } from 'react-query';
// components
import ProductsCarousel from 'src/components/carousels/products';
import { IoIosArrowForward } from 'react-icons/io';
import NextLink from 'src/utils/link';
export default function Index({ data }) {
  // const { data, isLoading } = useQuery(['featured-products'], () => api.getFeaturedProducts());
  const isLoading = false;
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h2" color="text.primary" mt={8}>
            Featured Products
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
          href={`/products?featured=true`}
        >
          View More
        </Button>
      </Stack>

      {!isLoading && !Boolean(data.length) ? (
        <Typography variant="h3" color="error.main" textAlign="center">
          Products not found
        </Typography>
      ) : (
        <ProductsCarousel data={data} isLoading={isLoading} />
      )}
    </Box>
  );
}
