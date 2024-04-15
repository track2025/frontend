'use client';
import React from 'react';
import * as api from 'src/services';
import { useQuery } from 'react-query';
import ShopDetailCover from 'src/components/_admin/shops/shopDetailCover';
import ShopDetail from 'src/components/_admin/shops/shopDetail';
export default function page({ params: { slug } }) {
  const { data, isLoading } = useQuery(['shop-by-admin'], () => api.getShopDetailsByAdmin(slug));
  console.log(data, 'data');
  return (
    <div>
      {/* {JSON.stringify(data)} */}
      <ShopDetailCover data={data?.data} isLoading={isLoading} />
      <ShopDetail />
    </div>
  );
}
