import React from 'react';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import UsersDetails from 'src/components/_admin/users/userDetails';

export default function page({ params }) {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="User Details"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Users',
            href: '/admin/users'
          },
          {
            name: 'Users details'
          }
        ]}
      />
      <UsersDetails id={params.id} />
    </>
  );
}
