'use client';
import React from 'react';
import { useRouter } from 'next-nprogress-bar';
// components
import Image from 'src/components/blurImage';
// mui
import { Typography, Box, Stack, Card, Grid, Skeleton, CardActionArea } from '@mui/material';
// // api
import * as api from 'src/services';
import { useQuery } from 'react-query';

export default function Brands() {
  const { push } = useRouter();
  const { data, isLoading } = useQuery(['get-brands-products'], () => api.getHomeBrands());

  return (
    <Box
      sx={{
        my: 6,
        display: { md: 'block', xs: 'none' }
      }}
    >
      <Typography variant="h1" color="text.primary" textAlign="center">
        Race Track Locations
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        className="description"
        sx={{
          textTransform: 'capitalize',
          mt: 1,
          mb: 5
        }}
      >
        Explore iconic race tracks from around the world—captured through the lens of passion, speed, and precision
      </Typography>

      {isLoading ? (
        <Skeleton variant="rounded" width={80} height={80} />
      ) : Boolean(data?.data.length) ? (
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
          {(isLoading ? Array.from(new Array(6)) : data?.data).map((v) => (
            <Grid key={v._id} item xs={6} sm={3} md={2}>
              <Card
                className="slider-main"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '10px',
                  position: 'relative',
                  mb: 3,
                  img: {
                    borderRadius: '8px',
                    objectFit: 'contain'
                  }
                }}
              >
                <CardActionArea onClick={() => push(`/race-track/${v.slug}`)} sx={{ p: 1, pr: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Image
                      src={v.logo.url}
                      alt={v.name}
                      width={70}
                      height={70}
                      draggable="false"
                      placeholder="blur"
                      objectFit="cover"
                      blurDataURL={v?.logo?.blurDataURL}
                    />
                    <Stack>
                      <Typography variant="subtitle1" color="text.primary" noWrap>
                        {v.name}
                      </Typography>
                      <Typography variant="body1" noWrap>
                        {v.totalProducts + ' ' + (v.totalProducts <= 1 ? 'Photo' : 'Photos')}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h3" color="error.main" textAlign="center">
          Brands not found
        </Typography>
      )}
    </Box>
  );
}
