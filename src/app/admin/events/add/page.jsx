import React from 'react';

// components
import AddEvent from 'src/components/_admin/events/addEvent';
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
        heading="Events"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Events',
            href: '/admin/events'
          },
          {
            name: 'Add A Event'
          }
        ]}
      />
      <AddEvent />
    </div>
  );
}
