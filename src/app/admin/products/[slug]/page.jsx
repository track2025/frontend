import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditProduct from 'src/components/_admin/products/editProduct';

// api
import * as api from 'src/services';

export default async function page({ params }) {
  const { data: categories } = await api.getAllCategories();
  const { data: brands } = await api.getAllBrandsByAdmin();
  const { data: shops } = await api.getAllShopsByAdmin();

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Media"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Media',
            href: '/admin/products'
          },
          {
            name: 'Upload New Media'
          }
        ]}
      />
      <EditProduct brands={brands} shops={shops} categories={categories} slug={params.slug} />
    </div>
  );
}
