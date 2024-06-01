import { Suspense } from 'react';

// mui
import { Container } from '@mui/material';
// components
import Hero from 'src/components/_main/home/hero';
// import Categories from 'src/components/_main/home/categories';
import BestSellingProducs from 'src/components/_main/home/bestSelling';
import Banner from 'src/components/_main/home/banner';
// import Brands from 'src/components/_main/home/brands';
import WhyUs from 'src/components/_main/home/whyUs';
import TopBanners from 'src/components/_main/home/topBanners';
import TopCollection from 'src/components/_main/home/top';
import FeaturedProducts from 'src/components/_main/home/featured';
// import Shops from 'src/components/_main/home/shop';
// import Compaigns from 'src/components/_main/home/compaign';
import Testimonials from 'src/components/_main/home/testimonials';
// import * as api from 'src/services';
import SubscriptionModal from 'src/components/_main/home/subscription';

// export const dynamic = 'force-dynamic';
// export async function fetchHomePageData() {
//   const res = await fetch('https://nextgater-mv-be-indol.vercel.app/api/shops?limit=5', {
//     next: { revalidate: 10 } // Revalidate the data every 10 seconds
//   });
//   if (!res.ok) {
//     throw new Error('Failed to fetch data');
//   }
//   const data = await res.json();
//   return data;
// }
// export async function getBestSellingProducts() {
//   const res = await fetch('https://nextgater-mv-be-indol.vercel.app/api/home/products/best-selling', {
//     next: { revalidate: 10 } // Revalidate the data every 10 seconds
//   });
//   if (!res.ok) {
//     throw new Error('Failed to fetch data');
//   }
//   const data = await res.json();
//   return data;
// }
export default async function IndexPage() {
  // const { data } = await fetchHomePageData();
  // const { data: bestSelling } = await getBestSellingProducts();
  // const { data } = await api.getBestSellingProducts();
  // const { data: featured } = await api.getFeaturedProducts();
  // const { data: bestSelling } = await api.getBestSellingProducts();
  // const { data: homeShops } = await api.getHomeShops();
  // const { data: compaigns } = await api.getHomeCompaigns('?limit=4');
  // const { data: brands } = await api.getHomeBrands();
  return (
    <>
      <Container maxWidth="xl">
        <Hero />
      </Container>
      <TopBanners />
      <Container maxWidth="xl">
        <WhyUs />
        {/* <Categories /> */}
        <Suspense>
          <BestSellingProducs data={[]} />
        </Suspense>
        {/* <Suspense>
          <Compaigns data={compaigns} />
        </Suspense> */}
      </Container>
      <Banner />
      <Container maxWidth="xl">
        <Suspense>
          {' '}
          <TopCollection data={[]} />{' '}
        </Suspense>
        <Suspense>{/* <Shops data={homeShops} /> */}</Suspense>
        <Suspense>
          {' '}
          <FeaturedProducts data={[]} />{' '}
        </Suspense>
      </Container>
      <Suspense>
        <Testimonials />
      </Suspense>
      <Container maxWidth="xl">
        {/* <Suspense>
          <Brands data={brands} />
        </Suspense> */}
      </Container>
      <SubscriptionModal />
    </>
  );
}
