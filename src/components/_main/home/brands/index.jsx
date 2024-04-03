'use client';
import Image from 'src/components/blurImage';
// mui
import { Typography, Box, Stack, Card, Link, Skeleton } from '@mui/material';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
// Marquee
import Marquee from 'react-fast-marquee';
import NextLink from 'next/link';

export default async function Brands() {
  const setting = {
    gradient: false
  };
  const { data, isLoading } = useQuery(['get-brands-products'], () => api.getHomeBrands());

  return (
    <Box
      sx={{
        mt: 6,
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
      ) : Boolean(data?.data.length) ? (
        <Marquee {...setting}>
          <Stack direction="row" alignItems="center">
            {data?.data.map((v) => (
              <Link component={NextLink} href={`/products?brand=${v.slug}`} key={v._id} mx={2.5}>
                <Card
                  className="slider-main"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 1,
                    width: '80px',
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
                  <Image
                    src={v.logo.url}
                    alt="logo"
                    width={70}
                    height={70}
                    draggable="false"
                    placeholder="blur"
                    blurDataURL={v?.logo?.blurDataURL}
                  />
                </Card>
              </Link>
            ))}
          </Stack>
        </Marquee>
      ) : (
        <Typography variant="h3" color="error.main" textAlign="center">
          Brands not found
        </Typography>
      )}
    </Box>
  );
}
