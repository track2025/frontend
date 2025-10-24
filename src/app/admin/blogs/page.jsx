import React from 'react';

// Components
import Blog from 'src/components/_admin/blogs/blogList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Blogs - Lap Snaps',
  applicationName: 'Lap Snaps',
  authors: 'Lap Snaps'
};

export default function Brands() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Blogs List"
        links={[
          {
            name: 'Admin Dashboard',
            href: '/admin'
          },
          {
            name: 'Blogs'
          }
        ]}
        action={{
          // href: `/admin/locations/add`,
          href: '#',
          title: 'Add A Blog'
        }}
      />
      <Blog />
    </>
  );
}
