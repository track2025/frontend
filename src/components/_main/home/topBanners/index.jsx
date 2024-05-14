'use client';
import React from 'react';
import Link from 'src/utils/link';
// mui
import { Box, Card, Grid, Stack, Typography, Button, Container } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, alpha } from '@mui/material/styles';
// next
import Image from 'next/image';
import watchImg from '../../../../../public/images/top-banners/watch.png';
import shoesImg from '../../../../../public/images/top-banners/shoes.png';

export default function Index() {
  const theme = useTheme();
  const isDeskTop = useMediaQuery(theme.breakpoints.up('xl'));
  const isDeskTopBtn = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <Box my={6}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item lg={6} md={6} xs={12} sm={6}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor:
                  theme.palette.mode === 'dark' ? alpha(theme.palette.primary.dark, 0.4) : theme.palette.primary.light,
                borderRadius: '12px',

                height: '100%',
                paddingX: { lg: theme.spacing(3), md: theme.spacing(1) }
              }}
            >
              <Stack spacing={isDeskTop ? 2 : 1.5} sx={{ p: { sm: '24px', xs: '12px' } }}>
                <Typography
                  variant={isDeskTop ? 'h3' : 'h4'}
                  color="common.white"
                  lineHeight={1.3}
                  sx={{
                    width: {
                      xl: '320px !important',
                      lg: '300px !important',
                      md: '220px !important',
                      xs: '170px !important'
                    },
                    fontSize: {
                      xl: 38,
                      lg: 38,
                      md: 28,
                      sm: 20,
                      xs: 20
                    }
                  }}
                >
                  Shop the latest from top brands
                </Typography>

                <Typography
                  variant={isDeskTop ? 'body1' : 'body2'}
                  color="common.white"
                  mb={2}
                  display={{ md: 'block', xs: 'none' }}
                  width={{ xl: 270 }}
                >
                  Fully Comforable and Smooth Product
                </Typography>
                <Box>
                  <Button
                    component={Link}
                    href="/products?gender=women"
                    variant="contained"
                    color={'primary'}
                    size={isDeskTopBtn ? 'large' : 'small'}
                    sx={{
                      borderRadius: 6
                    }}
                  >
                    View Collection
                  </Button>
                </Box>
              </Stack>
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 150, md: 280, lg: 294, xl: 340 },
                  height: { xs: 151, md: 290, lg: 290, xl: 320 },
                  zIndex: 1,
                  transform: { lg: 'scale(1.1)', md: 'scale(1.2)', xs: 'scale(1.3)' }
                }}
              >
                <Image fill objectFit="contain" draggable="false" src={watchImg} alt="women" sizes="20vw" />
              </Box>
            </Card>
          </Grid>
          {/* card 2  */}
          <Grid item lg={6} md={6} xs={12} sm={6}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.secondary.dark, 0.4)
                    : theme.palette.secondary.light,
                borderRadius: '12px',

                height: '100%',
                paddingX: { lg: theme.spacing(3), md: theme.spacing(1), xs: theme.spacing(1) }
              }}
            >
              <Stack spacing={isDeskTop ? 1 : 1.5} sx={{ p: { sm: '24px', xs: '12px' } }}>
                <Typography
                  variant={isDeskTop ? 'h3' : 'h4'}
                  color="common.white"
                  lineHeight={1.3}
                  sx={{
                    width: {
                      xl: '320px !important',
                      lg: '300px !important',
                      md: '220px !important',
                      xs: '170px !important'
                    },
                    fontSize: {
                      xl: 38,
                      lg: 38,
                      md: 28,
                      sm: 20,
                      xs: 20
                    }
                  }}
                >
                  Shop the latest from top brands
                </Typography>

                <Typography
                  variant={isDeskTop ? 'body1' : 'body2'}
                  color="common.white"
                  mb={2}
                  display={{ md: 'block', xs: 'none' }}
                  width={{ xl: 270 }}
                >
                  Fully Comforable and Smooth Product
                </Typography>
                <Box>
                  <Button
                    component={Link}
                    href="/products?gender=women"
                    variant="contained"
                    color={'secondary'}
                    size={isDeskTopBtn ? 'large' : 'small'}
                    sx={{
                      borderRadius: 6
                    }}
                  >
                    View Collection
                  </Button>
                </Box>
              </Stack>
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 150, md: 280, lg: 294, xl: 340 },
                  height: { xs: 151, md: 290, lg: 290, xl: 320 },
                  zIndex: 1,
                  transform: { lg: 'scale(1.1)', md: 'scale(1.2)', xs: 'scale(1.3)' },
                  marginLeft: { xs: '-40px', md: 0 }
                }}
              >
                <Image fill objectFit="contain" draggable="false" src={shoesImg} alt="women" sizes="20vw" />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
