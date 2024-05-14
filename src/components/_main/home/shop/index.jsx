'use client';
// react
import React from 'react';
import NextLink from 'src/utils/link';
// mui
import { Typography, Grid, Box, Stack, Paper, Button } from '@mui/material';
// icons
import { IoIosArrowForward } from 'react-icons/io';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
// component
import ShopCard from 'src/components/cards/shop';

export default function ShopComponent() {
  const { data, isLoading } = useQuery(['get-home-shops-all'], () => api.getHomeShops());

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

        <Box>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            {(isLoading ? Array.from(new Array(6)) : data?.data).map((inner) => (
              <React.Fragment key={Math.random()}>
                <Grid item lg={4} md={6} sm={6} xs={12}>
                  <ShopCard shop={inner} isLoading={isLoading} />
                </Grid>
              </React.Fragment>
            ))}
            {!isLoading && !Boolean(data?.data.length) && (
              <Typography variant="h3" color="error.main" textAlign="center">
                Shop not found
              </Typography>
            )}
          </Grid>
        </Box>
        {Boolean(data?.data?.length > 7) && (
          <Button
            variant="text"
            color="primary"
            endIcon={<IoIosArrowForward />}
            component={NextLink}
            href={`/shops`}
            sx={{
              mt: 3,
              mx: 'auto',
              display: 'flex',
              minWidth: 100
            }}
          >
            View All Shops
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
