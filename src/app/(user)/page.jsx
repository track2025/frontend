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
import ShopComponent from 'src/components/_main/home/shop';

export default async function IndexPage() {
  return (
    <>
      <Hero />
      <TopBanners />
      <Container fixed>
        <Categories />
        <ShopComponent />
        <Suspense>
          <TopCollections />
        </Suspense>
      </Container>
      <Banner />
      <Container fixed>
        <Suspense>
          <BestSeller />
        </Suspense>
        <Suspense>
          <Brands />
        </Suspense>
        <WhyUs />
      </Container>
    </>
  );
}
