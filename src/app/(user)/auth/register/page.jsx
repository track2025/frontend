// guard
import GuestGuard from 'src/guards/guest';
// mui
import { Card, Container, Typography } from '@mui/material';
// components
import RegisterMain from 'src/components/_main/auth/register';

// Meta information
export const metadata = {
  title: 'Create Account | Lap Snaps - Join Our Motorsport Photography Community',
  description:
    'Sign up for Lap Snaps to purchase professional race track photography, follow your favorite photographers, and build your motorsport photo collection.',
  applicationName: 'Lap Snaps',
  authors: 'Lap Snaps',
  keywords: 'register, Lap Snaps, motorsport photography, race track photos, create account',
  robots: {
    index: false,
    follow: true
  },
  alternates: {
    canonical: 'https://lapsnaps.com/auth/register'
  }
};

export default async function Register() {
  return (
    <>
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
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
              Sign up
            </Typography>
            <Typography color="text.secondary" mb={5} textAlign="center">
              Let’s get you started — create your account!
            </Typography>
            <RegisterMain />
          </Card>
        </Container>
    </>
  );
}
