import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import PhysicalProductList from 'src/components/_admin/physical-products/products';

// api
import * as api from 'src/services';

// Meta information
export const metadata = {
  title: 'Products - Lapsnap',
  applicationName: 'Lapsnap',
  authors: 'Lapsnap'
};
export const dynamic = 'force-dynamic';

export default async function AdminProducts() {
  const { data: categories } = await api.getAllPhysicalCategoriesByAdmin();
  const { data: brands } = await api.getAllPhysicalBrandsByAdmin();

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

      <PhysicalProductList categories={categories} brands={brands} />
    </div>
  );
}
