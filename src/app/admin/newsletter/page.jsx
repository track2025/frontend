import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import NewsletterList from 'src/components/_admin/newsletter/newsletterList';

// Meta information
export const metadata = {
  title: 'Newsletter - RaceTrackRegistry',
  applicationName: 'RaceTrackRegistry',
  authors: 'RaceTrackRegistry'
};
export default function page() {
  return (
    <div>
      {' '}
      <HeaderBreadcrumbs
        admin
        heading="Newsletter List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'newsletter'
          }
        ]}
      />
      <NewsletterList />
    </div>
  );
}
