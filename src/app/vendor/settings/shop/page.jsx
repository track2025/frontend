import React from 'react';
// Components
import Toolbar from 'src/components/_admin/toolbar';
import ShopSettingMain from 'src/components/_admin/vendor/settings/shopSettings';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
// Meta information
export const metadata = {
  title: 'Categories - Nextall',
  applicationName: 'Nextall',
  authors: 'Nextall'
};
export default function ShopSetting() {
  return (
    <>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Categories List"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Settings',
              href: '/dashboard/settings'
            },
            {
              name: 'Shop Settings'
            }
          ]}
        />
      </Toolbar>
      <ShopSettingMain />
    </>
  );
}
