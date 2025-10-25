import React from 'react';
import AddSubCategory from 'src/components/_admin/physical-categories/sub/add-category';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
export const dynamic = 'force-dynamic';
const baseUrl = process.env.BASE_URL;

export default async function page() {

  const res = await fetch(baseUrl + '/api/admin/all-physical-categories', {
    cache: 'no-store'
  });
  const { data: categories } = await res.json();

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Add Sub Category"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Sub Categories',
            href: '/admin/categories/sub-categories'
          },
          {
            name: 'Add Sub Category'
          }
        ]}
      />
      <AddSubCategory categories={categories} />
    </div>
  );
}
