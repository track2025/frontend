import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddSubCategory from 'src/components/_admin/subCategories/addCategory';

// api
import * as api from 'src/services';

export const metadata = {
  title: 'Add Vehicle Model - RaceTrackRegistry',
  applicationName: 'RaceTrackRegistry',
  authors: 'RaceTrackRegistry'
};

export default async function page() {
  const data = await api.getAllCategories();
  if (!data) {
    notFound();
  }
  const { data: categories } = data;
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Vehicle Model List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Vehicle Model',
            href: '/admin/vehicle-models'
          },
          {
            name: 'Add Model'
          }
        ]}
      />
      <AddSubCategory categories={categories} />
    </div>
  );
}
