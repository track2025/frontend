import React, { Suspense } from 'react';
// mui
import { Box } from '@mui/material';
// components
import Navbar from 'src/layout/_main/navbar';
import Footer from 'src/layout/_main/footer';
import { cookies } from 'next/headers';
import Topbar from 'src/layout/_main/topbar';
import ActionBar from 'src/layout/_main/actionbar';
// Meta information
export const metadata = {
  title: 'Nextall E-commerce Script | Your Gateway to Seamless Shopping and Secure Transactions',
  description:
    'Log in to Nextall for secure access to your account. Enjoy seamless shopping, personalized experiences, and hassle-free transactions. Your trusted portal to a world of convenience awaits. Login now!',
  applicationName: 'Nextall',
  authors: 'Nextall',
  keywords: 'ecommerce, Nextall, Commerce, Login Nextall, LoginFrom Nextall',
  icons: {
    icon: '/favicon.png'
  },
  openGraph: {
    images: 'https://nextall.vercel.app/opengraph-image.png?1c6a1fa20db2840f'
  }
};

export default async function RootLayout({ children }) {
  const cookiesList = cookies();
  const hasCookie = cookiesList.get('token');

  return (
    <>
      {/* <Suspense>
        <Topbar />
      </Suspense>
      <Navbar isAuth={hasCookie} />
      <ActionBar /> */}
      {/* <Box sx={{ height: 100, display: { xs: 'none', md: 'flex' } }} /> */}
      {children}
      {/* <Footer /> */}
    </>
  );
}
