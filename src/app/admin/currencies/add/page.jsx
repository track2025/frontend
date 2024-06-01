import React from 'react';
// Toolbar

// Breadcrumbs
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
// components
import AddCurrency from 'src/components/_admin/currencies/addCurrency';
export default function page() {
  return (
    <div>
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
            name: 'Add Currency'
          }
        ]}
      />
      <AddCurrency />
    </div>
  );
}
