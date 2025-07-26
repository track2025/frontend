import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import UsersList from 'src/components/_admin/users/userList';

// Meta information
export const metadata = {
  title: 'User - RaceTrackRegistry',
  applicationName: 'RaceTrackRegistry',
  authors: 'RaceTrackRegistry'
};
export default function page() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Users List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Users'
          }
        ]}
      />
      <UsersList />
    </>
  );
}
