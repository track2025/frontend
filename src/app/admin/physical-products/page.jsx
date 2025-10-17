import React from 'react';
import AdminProductsMain from 'src/components/_admin/physical-products/products';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// api
import * as api from 'src/services';

// Meta information
export const metadata = {
  title: 'Products - Nextall',
  applicationName: 'Nextall',
  authors: 'Nextall'
};
export const dynamic = 'force-dynamic';

export default async function AdminProducts() {
  const { data: categories } = await api.getAllPhysicalCategoriesByAdmin();
  const { data: brands } = await api.getAllBrandsByAdmin();
  const { data: shops } = await api.getAllShopsByAdmin();

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Products List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Products'
          }
        ]}
        action={{
          href: `/admin/physical-products/add`,
          title: 'Add Product'
        }}
      />
      <AdminProductsMain categories={categories} shops={shops} brands={brands} />
    </div>
  );
}
