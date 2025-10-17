import React from 'react';

// components
import AddBrand from 'src/components/_admin/physical-brands/add-brand';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Brands"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Brands',
            href: '/admin/physical-brands'
          },
          {
            name: 'Add Brand'
          }
        ]}
      />
      <AddBrand />
    </div>
  );
}
