import React from 'react';
import { Container } from '@mui/material';
// next
import dynamic from 'next/dynamic';
// skeleton
import HeaderBreadcrumbsSkeleton from 'src/components/skeletons/breadcrumbs';
import Compare from 'src/components/_main/compare';
const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <HeaderBreadcrumbsSkeleton />
});

export default function Page() {
  return (
    <Container fixed>
      <HeaderBreadcrumbs
        heading="Compare"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Compare'
          }
        ]}
      />
      <Compare />
    </Container>
  );
}
