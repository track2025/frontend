import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddCategory from 'src/components/_admin/categories/addCategory';

// Meta information
export const metadata = {
  title: 'Add Vehicle Make - Lap Snaps',
  applicationName: 'Lap Snaps',
  authors: 'Lap Snaps'
};

export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Vehicle Make List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Vehicle Make',
            href: '/admin/categories'
          },
          {
            name: 'Add Vehicle Make'
          }
        ]}
      />
      <AddCategory />
    </div>
  );
}
