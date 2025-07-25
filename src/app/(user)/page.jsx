'use client';
import dynamic from 'next/dynamic';

// mui
import { Container } from '@mui/material'; // Importing Container component from MUI (Material-UI) library.

// components
import Hero from 'src/components/_main/home/hero'; // Importing the Hero component.
import WhyUs from 'src/components/_main/home/whyUs'; // Importing the WhyUs component.
import TopBanners from 'src/components/_main/home/topBanners'; // Importing the TopBanners component.
import Image from 'next/image';

// Dynamic imports
const Categories = dynamic(() => import('src/components/_main/home/categories'));
const BestSellingProducs = dynamic(() => import('src/components/_main/home/bestSelling'));
const Banner = dynamic(() => import('src/components/_main/home/banner'));
const Brands = dynamic(() => import('src/components/_main/home/brands'));
const TopCollection = dynamic(() => import('src/components/_main/home/top'));
const Shops = dynamic(() => import('src/components/_main/home/shop'));
const Compaigns = dynamic(() => import('src/components/_main/home/compaign'));
const Testimonials = dynamic(() => import('src/components/_main/home/testimonials'));
const FeaturedProducts = dynamic(() => import('src/components/_main/home/featured'));
const SubscriptionModal = dynamic(() => import('src/components/_main/home/subscription'), {
  ssr: false
});

export default function IndexPage() {
  return (
  
    <>
      {/* <div maxWidth="xl">
        <img
          src="/images/rrr.jpg"
          height="550px"
          width="100%"
          style={{ objectFit: 'cover', width: '100%', height: '850px' }}
          alt="Banner"
        /> 
     </div> */}
     <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
  <video
    autoPlay
    muted
    loop
    playsInline
    style={{
      width: '100%',
      height: '700px',
      objectFit: 'cover',
    }}
  >
    <source src="/images/banner-vid.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>
      <TopBanners />
      <Container maxWidth="xl">
        <WhyUs />      
          <FeaturedProducts />

        {/* <BestSellingProducs /> */}
        <Compaigns />
      </Container>
      <Banner />
      <Container maxWidth="xl">
        <TopCollection />       
         <Categories />

        <Shops />
      </Container>
      <Testimonials />
      <Container maxWidth="xl">
        <Brands />
      </Container>
      <SubscriptionModal />
    </>
  );
}
