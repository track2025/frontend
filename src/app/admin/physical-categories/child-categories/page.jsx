import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import ChildCategoryList from 'src/components/_admin/physical-categories/child/category-list';

// apo
import * as api from 'src/services';

// Meta information
export const metadata = {
  title: 'Child Categories - Lapsnap',
  applicationName: 'Lapsnap',
  authors: 'Lapsnap'
};

export const dynamic = 'force-dynamic';
export default async function Categories() {
  const { data: categories } = await api.getAllPhysicalCategoriesByAdmin();
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Child Categories"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Child Categories'
          }
        ]}
        action={{
          href: `/admin/physical-categories/child-categories/add`,
          title: 'Add Child Category'
        }}
      />
      <ChildCategoryList categories={categories} />
    </>
  );
}
