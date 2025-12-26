import React from 'react';
// guard
import GuestGuard from 'src/guards/guest';
// mui
import { Card, Stack, Container, Typography } from '@mui/material';
// components
import LoginMain from 'src/components/_main/auth/login';

// Meta information
export const metadata = {
  title: 'Login | Lap Snaps - Access Your Race Track Photography Account',
  description:
    'Log in to Lap Snaps to access your motorsport photography collection, purchase race track photos, and manage your account.',
  applicationName: 'Lap Snaps',
  authors: 'Lap Snaps',
  keywords: 'login, Lap Snaps, motorsport photography, race track photos, account access',
  robots: {
    index: false,
    follow: true
  },
  alternates: {
    canonical: 'https://lapsnaps.com/auth/login'
  }
};

export default async function Login() {
  return (
    <>
    <GuestGuard>
        <Container maxWidth="sm">
          <Card
            sx={{
              maxWidth: 560,
              m: 'auto',
              my: '80px',
              flexDirection: 'column',
              justifyContent: 'center',
              p: 3
            }}
          >
            <Stack mb={5}>
              <Typography textAlign="center" variant="h4" component="h1" gutterBottom>
                Login
              </Typography>
              <Typography textAlign="center" color="text.secondary">
                Login to your account to continue
              </Typography>
            </Stack>

            <LoginMain />
          </Card>
        </Container>
      </GuestGuard>
    </>
  );
}
