import React from 'react';
import dynamic from 'next/dynamic';

// mui
import { Container } from '@mui/material';

// components
import HeaderBreadcrumbsSkeleton from 'src/components/skeletons/breadcrumbs';
import InvoiceSkeleton from 'src/components/_main/skeletons/profile/invoice';

// dynamic import
const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <HeaderBreadcrumbsSkeleton />
});
const InvoiceHistory = dynamic(() => import('src/components/_main/profile/invoiceHistory'), {
  loading: () => <InvoiceSkeleton />
});

// Meta information
export const metadata = {
  title: 'Invoice | Lap Snaps - Your Order Details and Payment Confirmation',
  applicationName: 'Lap Snaps',
  authors: 'Lap Snaps'
};

export default async function OrderPage() {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Orders"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Profile',
            href: '/profile/orders'
          },
          {
            name: 'Orders'
          }
        ]}
      />
      <InvoiceHistory />
    </Container>
  );
}
