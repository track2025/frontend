import React from 'react';

// Components
import EventList from 'src/components/_admin/events/eventList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Events - Lap Snaps',
  applicationName: 'Lap Snaps',
  authors: 'Lap Snaps'
};

export default function Brands() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Events List"
        links={[
          {
            name: 'Admin Dashboard',
            href: '/admin'
          },
          {
            name: 'Events'
          }
        ]}
        action={{
          // href: `/admin/locations/add`,
          href: '#',
          title: 'Add A Event'
        }}
      />
      <EventList />
    </>
  );
}
