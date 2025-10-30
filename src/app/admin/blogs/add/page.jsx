import React from 'react';

// components
import AddBlog from 'src/components/_admin/blogs/addBlog';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

export const metadata = {
  title: 'Add Track Location - Lap Snaps',
  applicationName: 'Lap Snaps',
  authors: 'Lap Snaps'
};

export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Blogs"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Blogs',
            href: '/admin/blogs'
          },
          {
            name: 'Add A Blog'
          }
        ]}
      />
      <AddBlog />
    </div>
  );
}
