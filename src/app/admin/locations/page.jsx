import React from 'react';

// Components
import BrandList from 'src/components/_admin/brands/brandList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Track Locations - RaceTrackRegistry',
  applicationName: 'RaceTrackRegistry',
  authors: 'RaceTrackRegistry'
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
