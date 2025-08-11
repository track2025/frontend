'use client';
import dynamic from 'next/dynamic';
import { Container } from '@mui/material'; 
import Hero from 'src/components/_main/home/hero'; 
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
      objectFit: 'cover',
    }}
  >
    <source src="/images/lapsnaps.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>
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
