import React from 'react';

// Components
import CategoryList from 'src/components/_admin/physical-categories/parent/category-list';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Categories - Nextall',
  applicationName: 'Nextall',
  authors: 'Nextall'
};

export default function Categories() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Categories"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Categories'
          }
        ]}
        action={{
          href: `/admin/physical-categories/add`,
          title: 'Add Category'
        }}
      />
      <CategoryList />
    </>
  );
}
