import React from 'react';

// Components
import CurrencyList from 'src/components/_admin/currencies/currencyList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Currencies - RaceTrackRegistry',
  applicationName: 'RaceTrackRegistry',
  authors: 'RaceTrackRegistry'
};
export default function Currencies() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Currencies List"
        links={[
          {
            name: 'Admin Dashboard',
            href: '/admin'
          },
          {
            name: 'Currencies'
          }
        ]}
        action={{
          href: `/admin/currencies/add`,
          title: 'Add currency'
        }}
      />
      <CurrencyList />
    </>
  );
}
