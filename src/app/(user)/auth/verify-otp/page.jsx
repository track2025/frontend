import React from 'react';
// guard
import AuthGuard from 'src/guards/auth';
import GuestGuard from 'src/guards/guest';
// mui
import { Box } from '@mui/material';
//  components
import OTPMain from 'src/components/_main/auth/otp';

// Meta information
export const metadata = {
  title: 'Verify Email | Lap Snaps - Confirm Your Account',
  description:
    'Complete email verification to access your Lap Snaps account and start purchasing professional motorsport photography.',
  applicationName: 'Lap Snaps',
  authors: 'Lap Snaps',
  keywords: 'verify email, Lap Snaps, account confirmation',
  robots: {
    index: false,
    follow: true
  },
  alternates: {
    canonical: 'https://lapsnaps.com/auth/verify-otp'
  }
};
export default async function VerifyOTP() {
  return (
    <>
      <GuestGuard>
        <Box className="auth-pages">
          <OTPMain />
        </Box>
      </GuestGuard>
    </>
  );
}
