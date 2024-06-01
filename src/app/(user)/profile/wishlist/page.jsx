import React from 'react';
// mui
import { Container, Grid } from '@mui/material';
// next
import dynamic from 'next/dynamic';
// skeletons
import BreadcrumbsSkeleton from 'src/components/_main/skeletons/products/breadcrumbs';
import ProductCard from 'src/components/_main/skeletons/products/productCard';
// Meta information
export const metadata = {
  title: 'Wishlist | Nextall - Save Your Favorite Items for Later',
  applicationName: 'Nextall',
  authors: 'Nextall'
};
// components
const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <BreadcrumbsSkeleton />
});
const WishlistMain = dynamic(() => import('src/components/_main/profile/wishlist'), {
  loading: () => (
    <>
      <Grid container spacing={2}>
        {Array.from(new Array(4)).map((idx) => (
          <Grid item md={3} xs={6} key={idx}>
            <ProductCard />
          </Grid>
        ))}
      </Grid>
    </>
  )
});

export default function Wishlist() {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Wishlist"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Profile',
            href: '/profile/wishlist'
          },
          {
            name: 'Wishlist'
          }
        ]}
      />
      <WishlistMain />
    </Container>
  );
}
