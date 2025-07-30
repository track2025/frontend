// guard
import GuestGuard from 'src/guards/guest';
// mui
import { Card, Container, Typography } from '@mui/material';
// components
import RegisterMain from 'src/components/_main/auth/register';

// Meta information
export const metadata = {
  title: 'Create Your Lap Snaps Account | Join Us for Exclusive Deals and Seamless Shopping',
  description:
    'Register with Lap Snaps today to unlock a world of exclusive deals, personalized recommendations, and secure transactions. Join our community for a seamless shopping experience. Sign up now and elevate your online shopping journey!',
  applicationName: 'Lap Snaps',
  authors: 'Lap Snaps',
  keywords: 'ecommerce, Lap Snaps, Commerce, Register Lap Snaps, RegisterFrom Lap Snaps'
};

export default async function Register() {
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
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
              Sign up
            </Typography>
            <Typography color="text.secondary" mb={5} textAlign="center">
              Create your account
            </Typography>
            <RegisterMain />
          </Card>
        </Container>
      </GuestGuard>
    </>
  );
}
