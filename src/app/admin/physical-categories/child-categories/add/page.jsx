import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddCategory from 'src/components/_admin/physical-categories/child/add-category';

// api
import * as api from 'src/services';
export const dynamic = 'force-dynamic';
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
        heading="Add Child Category"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Child Categories',
            href: '/admin/physical-categories/child-categories'
          },
          {
            name: 'Add Child Category'
          }
        ]}
      />
      <AddCategory categories={categories} />
    </div>
  );
}
