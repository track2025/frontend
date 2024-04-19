import React from 'react';

// components
import ProductList from 'src/components/_admin/products/productList';
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
          heading="Products List"
          links={[
            {
              name: 'Dashboard',
              href: '/admin'
            },
            {
              name: 'Products'
            }
          ]}
          action={{
            href: `/admin/products/add`,
            title: 'Add Product'
          }}
        />
      </Toolbar>
      <ProductList />
    </>
  );
}
