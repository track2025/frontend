import { Suspense } from 'react';

// mui
import { Container } from '@mui/material';

// components
import Hero from 'src/components/_main/home/hero';
import Categories from 'src/components/_main/home/categories';
import BestSeller from 'src/components/_main/home/bestSeller';
import Banner from 'src/components/_main/home/banner';
import TopCollections from 'src/components/_main/home/topCollections';
import Brands from 'src/components/_main/home/brands';
import WhyUs from 'src/components/_main/home/whyUs';
import TopBanners from 'src/components/_main/home/topBanners';
import BestSellerTwo from 'src/components/_main/home/bestSellerTwo';
import BestSellerThree from 'src/components/_main/home/bestSellerThree';
import ShopComponent from 'src/components/_main/home/shop';
import CompaignsComponent from 'src/components/_main/home/compaign';
import Testimonials from 'src/components/_main/home/testimonials';

export default async function IndexPage() {
  return (
    <>
      <Hero />
      <TopBanners />
      <Container maxWidth="xl">
        <Categories />
        <Suspense>
          <BestSeller />
        </Suspense>
        <Suspense>
          <CompaignsComponent />
        </Suspense>
      </Container>
      <Banner />
      <Container maxWidth="xl">
        <Suspense>
          <BestSellerTwo />
        </Suspense>
        <Suspense>
          <ShopComponent />
        </Suspense>
      </Container>
      <Suspense>
        <Testimonials />
      </Suspense>
      <Container maxWidth="xl">
        <Suspense>
          <BestSellerThree />
        </Suspense>
        <Suspense>
          <Brands />
        </Suspense>
      </Container>
      <WhyUs />
    </>
  );
}
