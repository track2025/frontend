import React from 'react';

// components
import ProductList from 'src/components/_admin/products/productList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Products - RaceTrackRegistry',
  applicationName: 'RaceTrackRegistry',
  authors: 'RaceTrackRegistry'
};
export default async function AdminProducts() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Media Files"
        links={[
          {
            name: 'Dashboard',
            href: '/'
          },
          {
            name: 'Media Files'
          }
        ]}
        action={{
          href: `/vendor/products/add`,
          title: 'Add Media'
        }}
      />
      <ProductList isVendor />
    </>
  );
}
