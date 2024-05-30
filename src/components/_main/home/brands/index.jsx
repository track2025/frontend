'use client';
import React from 'react';
import Image from 'src/components/blurImage';
// mui
import { Typography, Box, Stack, Card, Grid, Skeleton, CardActionArea } from '@mui/material';
// // api
// import * as api from 'src/services';
// import { useQuery } from 'react-query';
import { useRouter } from 'src/hooks/useRouter';

export default function Brands({ data }) {
  const { push } = useRouter();
  // const { data, isLoading } = useQuery(['get-brands-products'], () => api.getHomeBrands());
  const isLoading = false;
  return (
    <Box
      sx={{
        my: 6,
        display: { md: 'block', xs: 'none' }
      }}
    >
      <Typography variant="h2" color="text.primary" textAlign="center">
        Brands
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
        Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.
      </Typography>

      {isLoading ? (
        <Skeleton variant="rounded" width={80} height={80} />
      ) : Boolean(data?.length) ? (
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
          {(isLoading ? Array.from(new Array(6)) : data).map((v) => (
            <Grid key={v._id} item xs={6} sm={3} md={2}>
              <Card
                className="slider-main"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // width: '80px',
                  height: '80px',
                  borderRadius: '10px',
                  position: 'relative',
                  mb: 3,
                  img: {
                    borderRadius: '8px',
                    objectFit: 'contain'
                  }
                }}
              >
                <CardActionArea onClick={() => push(`/products?brand=${v.slug}`)} sx={{ p: 1, pr: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Image
                      src={v.logo.url}
                      alt="logo"
                      width={70}
                      height={70}
                      draggable="false"
                      placeholder="blur"
                      blurDataURL={v?.logo?.blurDataURL}
                    />
                    <Stack>
                      <Typography variant="subtitle1" color="text.primary" noWrap>
                        {v.name}
                      </Typography>
                      <Typography variant="body1" noWrap>
                        3 Products
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
