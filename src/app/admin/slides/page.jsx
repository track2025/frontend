import React from 'react';

// Components
import SlideList from 'src/components/_admin/slides/slideList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Slides - Lapsnaps',
  applicationName: 'Lapsnaps',
  authors: 'Lapsnaps'
};

export default function CustomSlide() {

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Slide List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Slides'
          }
        ]}
        action={{
                href: `/admin/slides/add`,
                title: 'Add Slide'
              }}
      />
      <SlideList />
    </>
  );
}
