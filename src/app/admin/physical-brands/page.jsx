import React from 'react';

// Components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import BrandList from 'src/components/_admin/physical-brands/brand-list';

// Meta information
export const metadata = {
  title: 'Brands - Lapsnaps',
  applicationName: 'Lapsnaps',
  authors: 'Lapsnaps'
};

export default function Brands() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Brands"
        links={[
          {
            name: 'Admin Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Brands'
          }
        ]}
        action={{
          href: `/admin/physical-brands/add`,
          title: 'Add Brand'
        }}
      />
      <BrandList />
    </>
  );
}
