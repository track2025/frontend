import React from 'react';
import dynamic from 'next/dynamic';

// mui
import { Container } from '@mui/material';

// component
import ContactUs from 'src/components/_main/contactUs';

import HeaderBreadcrumbsSkeleton from 'src/components/skeletons/breadcrumbs';
// skeleton

const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <HeaderBreadcrumbsSkeleton />
});

export const metadata = {
  title: 'Contact Lap Snaps – Get in Touch',
  description: "Have questions? Contact the Lap Snaps team for support, inquiries, or feedback. We're here to help!",
  alternates: {
    canonical: 'https://lapsnaps.com/contact'
  },
  openGraph: {
    title: 'Contact Lap Snaps – Get in Touch',
    description: "Have questions? Contact the Lap Snaps team for support, inquiries, or feedback. We're here to help!",
    url: 'https://lapsnaps.com/contact',
    type: 'website'
  }
};

export default function Page() {
  return (
    <Container maxWidth="xl">
      <HeaderBreadcrumbs
        heading="Contact Us"
        links={[
          {
            name: 'Home', 
            href: '/'
          },
          {
            name: 'Contact us'
          }
        ]}
      />
      <ContactUs />
    </Container>
  );
}
