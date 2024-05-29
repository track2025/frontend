import React from 'react';
// Components
import CategoryList from 'src/components/_admin/categories/categoryList';
import Toolbar from 'src/components/_admin/toolbar';
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
      {/* <Toolbar> */}
      <HeaderBreadcrumbs
        heading="Categories List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Categories'
          }
        ]}
        action={{
          href: `/admin/categories/add`,
          title: 'Add Category'
        }}
      />
      <br />
      {/* </Toolbar> */}
      <CategoryList />
    </>
  );
}
