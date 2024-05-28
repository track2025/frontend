import { Suspense } from 'react';

// mui
import { Container } from '@mui/material';

// components
import Hero from 'src/components/_main/home/hero';
import Categories from 'src/components/_main/home/categories';
import BestSellingProducs from 'src/components/_main/home/bestSelling';
import Banner from 'src/components/_main/home/banner';
import Brands from 'src/components/_main/home/brands';
import WhyUs from 'src/components/_main/home/whyUs';
import TopBanners from 'src/components/_main/home/topBanners';
import TopCollection from 'src/components/_main/home/top';
import FeaturedProducts from 'src/components/_main/home/featured';
import Shops from 'src/components/_main/home/shop';
import Compaigns from 'src/components/_main/home/compaign';
import Testimonials from 'src/components/_main/home/testimonials';

export default async function IndexPage() {
  return (
    <>
      <Hero />
      <TopBanners />

      <Container maxWidth="xl">
        <WhyUs />
        <Categories />
        <Suspense>
          <BestSellingProducs />
        </Suspense>
        <Suspense>
          <Compaigns />
        </Suspense>
      </Container>
      <Banner />
      <Container maxWidth="xl">
        <Suspense>
          <TopCollection />
        </Suspense>
        <Suspense>
          <Shops />
        </Suspense>
        <Suspense>
          <FeaturedProducts />
        </Suspense>
      </Container>
 
      <Suspense>
        <Testimonials />
      </Suspense>
      <Container maxWidth="xl">
        <Suspense>
          <Brands />
        </Suspense>
      </Container>
 

      <WhyUs />
 
    </>
  );
}
