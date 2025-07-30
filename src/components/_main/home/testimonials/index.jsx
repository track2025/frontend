'use client';
import React from 'react';
// Next
import Image from 'next/image';
// MUI
import { alpha, Box, Grid, Typography, Container, Stack, Fab } from '@mui/material';
// icons
import { IoArrowForward } from 'react-icons/io5';
import { IoArrowBackOutline } from 'react-icons/io5';
// Image
import bgImage from '../../../../../public/images/testimonial.png';
import AvatarImg from '../../../../../public/images/avatar.png';
// Components
import TestimonialCarousel from 'src/components/carousels/testimonial';
import { useSelector } from 'react-redux';

// data
const data = [
  {
    cover: { url: AvatarImg },
    name: 'Emily Ross',
    jobTitle: 'Trackside Photographer',
    reviewdetail:
      'LapSnap gives my work the spotlight it deserves. Uploading and selling race-day shots has never been easier!',
    reviews: 5
  },
  {
    cover: { url: AvatarImg },
    name: 'David Kim',
    jobTitle: 'Motorsport Enthusiast',
    reviewdetail:
      'I found high-quality shots of my car right after the event. The platform is smooth, fast, and reliable.',
    reviews: 4
  },
  {
    cover: { url: AvatarImg },
    name: 'Sofia Mendes',
    jobTitle: 'Videographer',
    reviewdetail:
      'Selling race footage through LapSnap has been a game changer. It connects me directly with passionate drivers and fans.',
    reviews: 5
  }
];

export default function Testimonials() {
  const { themeMode } = useSelector(({ settings }) => settings);
  const [[page, direction], setPage] = React.useState([0, 0]);
  const imageIndex = Math.abs(page % data?.length);
  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };
  const isDarkMode = themeMode === 'dark';
  return (
    <Box
      sx={{
        mt: 3,
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        py: 6
        // display: { xs: 'none', md: 'block' }
      }}
    >
      <Image priority src={bgImage} alt="centered-banner" layout="fill" objectFit="cover" static draggable="false" />
      <Container maxWidth="xl">
        <Grid container  className="row">
          <Grid item xs={12} md={6} className="col-md-6">
            <Typography
              variant="h3"
              mb={2}
              maxWidth={{ xs: '100%', md: 400 }}
              lineHeight={1.2}
              textAlign={{ xs: 'center', md: 'left' }}
            >
              What our community is saying about LapSnaps
            </Typography>
            <Stack sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Typography variant="body1" color="text.secondary" mb={4} maxWidth={{ xs: '100%', md: 550 }}>
                Hear from photographers, racers, and fans who use LapSnaps to buy and sell authentic race track visuals.
                Real stories. Real impact.
              </Typography>
            </Stack>
            <Stack
              direction={'row'}
              alignItems="center"
              justifyContent={{ xs: 'center', md: 'start' }}
              spacing={3}
              mt={4}
            >
              <Fab
                color="primary"
                aria-label="back"
                size="small"
                onClick={() => paginate(-1)}
                // disabled={page === 0}
                sx={{
                  bgcolor: isDarkMode ? 'primary.main' : 'background.paper',
                  color: isDarkMode ? 'common.white' : 'primary.main',
                  zIndex: 99
                }}
              >
                <IoArrowBackOutline size={24} />
              </Fab>
              <Fab
                color="primary"
                aria-label="forward"
                size="small"
                onClick={() => paginate(1)}
                sx={{
                  bgcolor: isDarkMode ? 'primary.main' : 'background.paper',
                  color: isDarkMode ? 'common.white' : 'primary.main',
                  zIndex: 99
                }}
              >
                <IoArrowForward size={24} />
              </Fab>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} className="col-md-6">
            <TestimonialCarousel
              images={data}
              direction={direction}
              page={page}
              imageIndex={imageIndex}
              paginate={paginate}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
