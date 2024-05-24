'use client';
// react
import React from 'react';
import NextLink from 'src/utils/link';
// mui
import { Typography, Grid, Box, Stack, Paper, Button } from '@mui/material';
// icons
import { IoIosArrowForward } from 'react-icons/io';
// api
// import * as api from 'src/services';
// import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

// component
import ShopCard from 'src/components/cards/shop';

export default function ShopComponent() {
  const data = useSelector(({ shops }) => shops);
  console.log(data, 'shops');

  return (
    <Paper elevation={0}>
      <Stack
        direction={'column'}
        sx={{
          gap: 3,
          mt: 5
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h2" color="text.primary" mt={{ xs: 5, md: 8 }}>
              Best Shops
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={5}>
              Our Highest Rated Shops Where You Can Find What You Are Looking For
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
      </Stack>
    </Paper>
  );
}
