'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter, usePathname } from 'next/navigation';

// mui
import { useTheme } from '@mui/material';

// components
import ShopDetailCover from 'src/components/_admin/shops/shopDetailCover';
import ShopDetail from 'src/components/_admin/shops/shopDetail';
import ShopIcomeList from '../../../../components/_admin/shops/shopIncome';

// icons
import { FaGifts } from 'react-icons/fa6';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { TbChartArrowsVertical } from 'react-icons/tb';
import { FaWallet } from 'react-icons/fa6';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
import ShopOrderList from 'src/components/_admin/shops/shopOrder';
import ShopProductList from 'src/components/_admin/shops/shopProduct';

Page.propTypes = {
  params: PropTypes.object.isRequired
};

export default function Page({ params: { slug } }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const [count, setCount] = useState(0);
  const { data, isLoading } = useQuery(['shop-by-admin', count], () => api.getShopDetailsByAdmin(slug));

  const [viewSection, setViewSection] = useState('income');

  function SetDataType(type) {
    // clear query params and keep only pathname
    router.replace(pathname);
    setViewSection(type);
  }

  const dataMain = [
    {
      name: 'Total Income',
      items: data?.totalEarnings,
      color: theme.palette.error.main,
      icon: <FaWallet size={30} />,
      viewFunction: () => SetDataType('income')
    },
    {
      name: 'Total Commission',
      items: data?.totalCommission,
      color: theme.palette.success.main,
      icon: <TbChartArrowsVertical size={30} />
    },

    {
      name: 'Total Orders',
      items: data?.totalOrders,
      color: theme.palette.secondary.main,
      icon: <HiOutlineClipboardList size={30} />,
      viewFunction: () => SetDataType('order')
    },

    {
      name: 'Total Media Files',
      items: data?.totalProducts,
      color: theme.palette.primary.main,
      icon: <FaGifts size={30} />,
      viewFunction: () => SetDataType('media')
    }
  ];
  return (
    <div>
      {/* {JSON.stringify(data)} */}
      <ShopDetailCover data={data?.data} isLoading={isLoading} />
      <ShopDetail data={dataMain} isLoading={isLoading} />

      {viewSection === 'order' && <ShopOrderList slug={slug} />}

      {viewSection === 'income' && (
        <ShopIcomeList slug={slug} onUpdatePayment={() => setCount((prev) => prev + 1)} count={count} />
      )}

      {viewSection === 'media' && <ShopProductList slug={slug} />}
    </div>
  );
}
