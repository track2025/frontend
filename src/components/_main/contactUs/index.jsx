'use client';
import React from 'react';
import NextLink from 'next/link';
// material
import { Stack, Typography, Box, Link, Grid, IconButton } from '@mui/material';
// components
import ContactUs from 'src/components/forms/contact';
import RootStyled from './styled';

// icons
import { MdEmail } from 'react-icons/md';
import { PiPhoneCall } from 'react-icons/pi';

const index = () => {
  return (
    <RootStyled>
      <Grid container spacing={6}>
        <Grid
          item
          xs={12}
          md={6}
          textAlign={{ xs: 'center', md: 'left' }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Stack>
            
            <Typography variant="h1" fontWeight={800} sx={{ marginY: 2 }}>
              Get in touch <span>Today!</span>
            </Typography>
            <Typography variant="body1" fontWeight={500} color="text.secondary" sx={{ mb: 3 }}>
              We're here to listen, assist, and answer any questions you may have. Whether you're interested in our
              services, seeking collaborations, or simply want to connect, our team is ready to provide personalized
              support.
            </Typography>
          </Stack>
        </Grid>
          <ContactUs />
      </Grid>
    </RootStyled>
  );
};

export default index;
