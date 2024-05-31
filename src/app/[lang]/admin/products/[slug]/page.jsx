import React from 'react';

import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditProduct from 'src/components/_admin/products/editProduct';
import * as api from 'src/services';
export default async function page({ params }) {
  const data1 = await api.getAllCategories();
  const data2 = await api.getAllBrandsByAdmin();
  const data3 = await api.getAllShopsByAdmin();
  if (!data1 || !data2 || !data3) {
    notFound();
  }
  const { data: categories } = data1;
  const { data: brands } = data2;
  const { data: shops } = data3;

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Product List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
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
      <EditProduct brands={brands} shops={shops} categories={categories} slug={params.slug} />
    </div>
  );
}
