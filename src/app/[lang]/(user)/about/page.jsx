import { Container } from '@mui/material';
import React from 'react';
// component
import AboutUs from 'src/components/_main/about';
// next
import dynamic from 'next/dynamic';
// skeleton
import HeaderBreadcrumbsSkeleton from 'src/components/skeletons/breadcrumbs';
const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <HeaderBreadcrumbsSkeleton />
});

export default function Page() {
  return (
    <>
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="About Us"
          links={[
            {
              name: 'Home',
              href: '/'
            },
            {
              name: 'About us'
            }
          ]}
        />
      </Container>
      <AboutUs />
    </>
  );
}
