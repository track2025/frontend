import React from 'react';
// Components
import CompaignList from 'src/components/_admin/compaigns/compaignList';
// Toolbar
import Toolbar from 'src/components/_admin/toolbar';
// Breadcrumbs
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Currencies - Nextall',
  applicationName: 'Nextall',
  authors: 'Nextall'
};
export default function Currencies() {
  return (
    <>
      <Toolbar>
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
      </Toolbar>
      <CompaignList />
    </>
  );
}
