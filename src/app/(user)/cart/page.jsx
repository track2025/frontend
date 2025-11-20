import React from 'react';

// mui
import { Container } from '@mui/material';

// component
import CartMain from 'src/components/_main/cart';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import Banner from 'src/components/_main/banner/HeroBanner';

// Meta information
export const metadata = {
  title: 'Lap Snaps Shopping Cart | Lap Snaps - Convenient Shopping Cart for Easy Checkout',
  description:
    'View your shopping cart on Lap Snaps for easy checkout. Add, remove, and manage items effortlessly. Enjoy a seamless shopping experience with secure transactions and personalized recommendations. Explore your cart now!',
  applicationName: 'Lap Snaps',
  authors: 'Lap Snaps',
  keywords:
    'shopping cart, Lap Snaps, view cart, cart items, add to cart, remove from cart, manage cart, checkout, online shopping, secure transactions, personalized recommendations, seamless shopping, convenient shopping'
};

export default async function Cart() {
  return (
    <Container maxWidth="xl">
      <Banner
        backgroundImage="/images/cart-banner.jpg"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Products', href: '/race-track/collection' },
          { name: 'Cart', href: '#' }
        ]}
        title={''}
        // subtitle={`Explore our ${category?.name} collection`}
        height={'250px'}
      />
      {/* <HeaderBreadcrumbs
        heading="Cart"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Products',
            href: '/race-track/collection'
          },
          {
            name: 'Cart'
          }
        ]}
      /> */}
      <CartMain />
    </Container>
  );
}
