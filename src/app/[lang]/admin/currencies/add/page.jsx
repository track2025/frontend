import React from 'react';
// Toolbar
import Toolbar from 'src/components/_admin/toolbar';
// Breadcrumbs
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
// components
import AddCurrency from 'src/components/_admin/currencies/addCurrency';
export default function page() {
  return (
    <div>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Currency List"
          links={[
            {
              name: 'Dashboard',
              href: '/admin'
            },
            {
              name: 'Currencies',
              href: '/admin/currencies'
            },
            {
              name: 'Add currency'
            }
          ]}
        />
      </Toolbar>
      <AddCurrency />
    </div>
  );
}
