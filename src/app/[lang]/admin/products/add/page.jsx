import React from 'react';
// components
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddProduct from 'src/components/_admin/products/addProduct';
import * as api from 'src/services';
export default async function page() {
  const data1 = await api.getAllCategories();
  const data2 = await api.getAllBrands();
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
      <AddProduct brands={brands} shops={shops} categories={categories} />
    </div>
  );
}
