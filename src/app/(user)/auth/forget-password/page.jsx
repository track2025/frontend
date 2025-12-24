// guard
import GuestGuard from 'src/guards/guest';
//  components
import ForgetPasswordMain from 'src/components/_main/auth/forgetPassword';

// Meta information
export const metadata = {
  title: 'Reset Password | Lap Snaps - Recover Your Account',
  description: 'Reset your Lap Snaps password to regain access to your motorsport photography account.',
  applicationName: 'Lap Snaps',
  authors: 'Lap Snaps',
  keywords: 'reset password, Lap Snaps, account recovery, forgot password',
  robots: {
    index: false,
    follow: true
  },
  alternates: {
    canonical: 'https://lapsnaps.com/auth/forget-password'
  }
};

export default function ForgetPassword() {
  return (
    <>
      <GuestGuard>
        <ForgetPasswordMain />
      </GuestGuard>
    </>
  );
}
