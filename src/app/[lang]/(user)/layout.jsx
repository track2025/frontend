import React from 'react';
// components
import Navbar from 'src/layout/_main/navbar';
import Footer from 'src/layout/_main/footer';
import Topbar from 'src/layout/_main/topbar';
import ActionBar from 'src/layout/_main/actionbar';
import * as api from 'src/services';
import dynamic from 'next/dynamic';
import Subscription from 'src/layout/_main/subscription';

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
export const revalidate = 1; // revalidate at most every hour
export const dynamic = 'error';
export default async function RootLayout({ children }) {
  const { data } = await api.getAllCategories();
  return (
    <>
      <Topbar />
      <Navbar />
      <ActionBar data={data} />
      {/* <Box sx={{ height: 100, display: { xs: 'none', md: 'flex' } }} /> */}
      {children}
      <Footer />
      <Subscription />
    </>
  );
}
