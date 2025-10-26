import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditPhysicalProduct from 'src/components/_admin/physical-products/edit-product';

// api
import * as api from 'src/services';
export const dynamic = 'force-dynamic';

export default async function page(props) {
  const params = await props.params;
  const { data: categories } = await api.getAllPhysicalCategoriesByAdmin();
  const { data: brands } = await api.getAllPhysicalBrandsByAdmin();

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit Product"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Products',
            href: '/admin/physical-products'
          },
          {
            name: 'Edit Product'
          }
        ]}
      />
      <EditPhysicalProduct brands={brands} categories={categories} slug={params.slug} />
    </div>
  );
}
