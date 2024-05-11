import React from 'react';
import AdminShopForm from 'src/components/forms/adminShop';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import Toolbar from 'src/components/_admin/toolbar';
export default function Page() {
  return (
    <>
      <Toolbar>
        <HeaderBreadcrumbs
          heading="Dashboard"
          admin
          links={[
            {
              name: 'Admin',
              href: '/admin'
            },
            {
              name: 'Shops',
              href: '/admin/shops'
            },
            {
              name: 'Add'
            }
          ]}
        />
      </Toolbar>
      <AdminShopForm />
    </>
  );
}
