'use client';
import React from 'react';
import * as api from 'src/services';
import { useQuery } from 'react-query';
import ShopDetailCover from 'src/components/_admin/shops/shopDetailCover';
import ShopDetail from 'src/components/_admin/shops/shopDetail';
import ShopIcomeList from '../../../../components/_admin/shops/shopIncome';
export default function page({ params: { slug } }) {
  const { data, isLoading } = useQuery(['shop-by-admin'], () => api.getShopDetailsByAdmin(slug));
  // const { data: IncomeData, loading } = useQuery(['shop-by-admin-icome'], () => api.getIncomeByShop(slug));
  // console.log(IncomeData, 'data Income');
  return (
    <div>
      {/* {JSON.stringify(data)} */}
      <ShopDetailCover data={data?.data} isLoading={isLoading} />
      <ShopDetail data={data} />
      <ShopIcomeList IncomeData={slug} />
    </div>
  );
}
