import React from 'react';

// Components
import BrandList from 'src/components/_admin/brands/brandList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Track Locations - Nextall',
  applicationName: 'Nextall',
  authors: 'Nextall'
};

export default function Brands() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Locations List"
        links={[
          {
            name: 'Admin Dashboard',
            href: '/admin'
          },
          {
            name: 'Locations'
          }
        ]}
        action={{
          href: `/admin/locations/add`,
          title: 'Add A Location'
        }}
      />
      <BrandList />
    </>
  );
}
