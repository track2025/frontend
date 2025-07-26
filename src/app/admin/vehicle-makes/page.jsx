import React from 'react';

// Components
import CategoryList from 'src/components/_admin/categories/categoryList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Vehicle Make - RaceTrackRegistry',
  applicationName: 'RaceTrackRegistry',
  authors: 'RaceTrackRegistry'
};

export default function Categories() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Vehicle Make List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: '"Vehicle Makes'
          }
        ]}
        action={{
          href: `/admin/vehicle-makes/add`,
          title: 'Add A New Make'
        }}
      />

      <CategoryList />
    </>
  );
}
