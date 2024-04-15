'use client';
import React from 'react';
// Components
import Toolbar from 'src/components/_admin/toolbar';
import ShopSettingMain from 'src/components/_admin/vendor/settings/shopSettings';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
// Meta information
// export const metadata = {
//   title: 'Shop Setting - Nextall',
//   applicationName: 'Nextall',
//   authors: 'Nextall'
// };

export default function ShopSetting() {
  const { data, isLoading } = useQuery(['get-vendor-dhop'], () => api.getVendorShop(), {
    retry:false
  });
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
              href: '/vendor/settings'
            },
            {
              name: 'Shop Settings'
            }
          ]}
        />
      </Toolbar>
      <ShopSettingMain data={data?.data} isLoading={isLoading} />
    </>
  );
}
