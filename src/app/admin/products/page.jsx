import React from 'react';

// components
import ProductList from 'src/components/_admin/products/productList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// api
import * as api from 'src/services';
import { SortArrayAlphabetically } from 'src/utils/sorting';

// Meta information
export const metadata = {
  title: 'Products - Lap Snaps',
  applicationName: 'Lap Snaps',
  authors: 'Lap Snaps'
};

export default async function AdminProducts() {
  const { data: categories } = await api.getAllCategoriesByAdmin();
  const { data: brands } = await api.getAllBrandsByAdmin();
  const { data: shops } = await api.getAllShopsByAdmin();

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Media"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Media'
          }
        ]}
        action={{
          href: `/admin/products/add`,
          title: 'Upload New Media'
        }}
      />

      <ProductList categories={SortArrayAlphabetically(categories, 'name')} shops={shops} brands={brands} />
    </>
  );
}
