import React from 'react';

// components
import SubCategoryList from 'src/components/_admin/subCategories/categoryList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// apo
import * as api from 'src/services';

// Meta information
export const metadata = {
  title: 'Sub Categories - Lap Snaps',
  applicationName: 'Lap Snaps',
  authors: 'Lap Snaps'
};

export default async function Categories() {
  const { data: categories } = await api.getAllCategoriesByAdmin();
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Vehicle Model List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Vehicle Model'
          }
        ]}
        action={{
          href: `/admin/vehicle-models/add`,
          title: 'Add Vehicle Model'
        }}
      />
      <SubCategoryList categories={categories} />
    </>
  );
}
