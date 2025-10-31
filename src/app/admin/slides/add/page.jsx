import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddSlide from 'src/components/_admin/slides/addSlide';

// Meta information
export const metadata = {
  title: 'Add Categories - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Add Slide"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Slides',
            href: '/admin/slides'
          },
          {
            name: 'Add Slide'
          }
        ]}
      />
      <AddSlide />
    </div>
  );
}
