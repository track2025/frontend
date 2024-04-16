import React from 'react';

// components
import ShopList from 'src/components/_admin/shops/shopList';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
// Meta information
export const metadata = {
  title: 'Products - Nextall',
  applicationName: 'Nextall',
  authors: 'Nextall'
};
export default async function AdminProducts() {
  return (
    <>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Shops"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Shops'
            }
          ]}
          action={{
            href: `/admin/shops/add`,
            title: 'Add Shop'
          }}
        />
      </Toolbar>
      <ShopList />
    </>
  );
}
