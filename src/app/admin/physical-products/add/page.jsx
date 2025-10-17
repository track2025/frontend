import React from 'react';
import AddProduct from 'src/components/_admin/physical-products/add-product';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// api
import * as api from 'src/services';
export const dynamic = 'force-dynamic';

export default async function page() {
  const { data: categories } = await api.getAllCategories();
  const { data: brands } = await api.getAllBrandsByAdmin();
  const { data: shops } = await api.getAllShopsByAdmin();
  const { data: attributes } = await api.getAllAttributesByAdmin();
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
      {/* <AddProduct brands={brands} shops={shops} categories={categories} attributes={attributes} /> */}
    </div>
  );
}
