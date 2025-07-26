import React from 'react';

// components
import AddBrand from 'src/components/_admin/brands/addBrand';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

export const metadata = {
  title: 'Add Track Location - RaceTrackRegistry',
  applicationName: 'RaceTrackRegistry',
  authors: 'RaceTrackRegistry'
};

export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Locations List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Locations',
            href: '/admin/locations'
          },
          {
            name: 'Add A Location'
          }
        ]}
      />
      <AddBrand />
    </div>
  );
}
