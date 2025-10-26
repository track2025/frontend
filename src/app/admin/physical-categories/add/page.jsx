import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddCategory from 'src/components/_admin/physical-categories/parent/add-category';

// Meta information
export const metadata = {
  title: 'Add Categories - Lapsnap',
  applicationName: 'Lapsnap',
  authors: 'Lapsnap'
};

export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Add Category"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Categories',
            href: '/admin/physical-categories'
          },
          {
            name: 'Add Category'
          }
        ]}
      />
      <AddCategory />
    </div>
  );
}
