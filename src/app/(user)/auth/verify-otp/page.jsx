import React from 'react';
// guard
import AuthGuard from 'src/guards/auth';
// mui
import { Box } from '@mui/material';
//  components
import OTPMain from 'src/components/_main/auth/otp';

// Meta information
export const metadata = {
  title: 'Verify Your Email with Lap Snaps | Confirm Your Account for Secure Shopping',
  description:
    'Complete the email verification process at Lap Snaps to ensure a secure and personalized shopping experience. Confirm your account and gain access to exclusive features. Shop confidently with a verified email. Verify now!',
  applicationName: 'Lap Snaps',
  authors: 'Lap Snaps',
  keywords: 'ecommerce, Lap Snaps, Commerce, VerifyEmail Lap Snaps, VerifyEmail Page Lap Snaps'
};
export default async function VerifyOTP() {
  return (
    <>
      <AuthGuard>
        <Box className="auth-pages">
          <OTPMain />
        </Box>
      </AuthGuard>
    </>
  );
}
