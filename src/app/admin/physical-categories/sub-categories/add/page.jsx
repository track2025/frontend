import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddSubCategory from '@/components/_admin/categories/sub/add-category';
export const dynamic = 'force-dynamic';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export default async function page() {
  const res = await fetch(baseUrl + '/api/all-categories', {
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
