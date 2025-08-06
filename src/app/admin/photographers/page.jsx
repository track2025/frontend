import React from 'react';

// components
import ShopList from 'src/components/_admin/shops/shopList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Photographers - Lap Snaps',
  applicationName: 'Lap Snaps',
  authors: 'Lap Snaps'
};

export default async function AdminProducts() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Photographers"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Photographers'
          }
        ]}
        action={{
          href: `/admin/photographers/add`,
          title: 'Add Photographer'
        }}
      />
      <ShopList />
    </>
  );
}
