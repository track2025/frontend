'use client';
import dynamic from 'next/dynamic';
import { Container, Typography } from '@mui/material';
import WhyUs from 'src/components/_main/home/whyUs';
import TopBanners from 'src/components/_main/home/topBanners';
import Image from 'next/image';

// Dynamic imports
const Categories = dynamic(() => import('src/components/_main/home/categories'));
const BestSellingProducs = dynamic(() => import('src/components/_main/home/bestSelling'));
const Banner = dynamic(() => import('src/components/_main/home/banner'));
const Brands = dynamic(() => import('src/components/_main/home/brands'));
const TopCollection = dynamic(() => import('src/components/_main/home/top'));
const Shops = dynamic(() => import('src/components/_main/home/shop'));
const Testimonials = dynamic(() => import('src/components/_main/home/testimonials'));
const FeaturedProducts = dynamic(() => import('src/components/_main/home/featured'));

export default function IndexPage() {
  return (
    <>
      <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '500px',
            objectFit: 'cover'
          }}
        >
          <source src="/images/lapsnaps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <Typography
        variant="h1"
        component="h1"
        sx={{
          textAlign: 'center',
          fontSize: {
            xs: '1rem', // small screens (mobile)
            sm: '1rem', // tablets
            md: '1.5rem' // desktops
          },
          fontWeight: 600,
          mt: 4 // margin-top
        }}
      >
        Welcome to Lap Snaps — High-Quality Vehicle Photography
      </Typography>
      <TopBanners />
      <Container maxWidth="xl">
        <WhyUs />
        <FeaturedProducts />
      </Container>
      <Banner />
      <Container maxWidth="xl">
        <TopCollection />
        {/* <Categories /> */}

        {/* <Shops /> */}
      </Container>
      <Testimonials />
      <Container maxWidth="xl">
        <Brands />
      </Container>
    </>
  );
}
