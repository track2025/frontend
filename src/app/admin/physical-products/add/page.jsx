import React from 'react';
import AddProduct from 'src/components/_admin/physical-products/add-product';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// api
import * as api from 'src/services';
export const dynamic = 'force-dynamic';

export default async function page() {
  const { data: categories } = await api.getAllPhysicalCategoriesByAdmin();
  const { data: brands } = await api.getAllPhysicalBrandsByAdmin();
  const { data: attributes } = await api.getAllPhysicalAttributesByAdmin();
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Add Product"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Products',
            href: '/admin/products'
          },
          {
            name: 'Add Product'
          }
        ]}
      />
      <AddProduct brands={brands} categories={categories} attributes={attributes} />
    </div>
  );
}
