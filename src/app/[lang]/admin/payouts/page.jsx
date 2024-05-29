import React from 'react';
// Components
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import PayoutsList from 'src/components/_admin/payouts';
// Meta information
export const metadata = {
  title: 'Payouts - Nextall',
  applicationName: 'Nextall',
  authors: 'Nextall'
};
export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Payouts"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Payouts'
          }
        ]}
      />
      <PayoutsList />
    </div>
  );
}
