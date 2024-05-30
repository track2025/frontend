import React from 'react';
// Components
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import PayoutsList from 'src/components/_admin/payouts';
import * as api from 'src/services';
// Meta information
export const metadata = {
  title: 'Payouts - Nextall',
  applicationName: 'Nextall',
  authors: 'Nextall'
};
export default async function page() {
  const { data: shops } = await api.getAllShopsByAdmin();
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
      <PayoutsList shops={shops} />
    </div>
  );
}
