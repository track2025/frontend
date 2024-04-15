'use client';
import React from 'react';
import * as api from 'src/services';
import { useQuery } from 'react-query';
export default function page({ params: { slug } }) {
  const { data, isLoading } = useQuery(['shop-by-admin'], () => api.getShopDetailsByAdmin(slug));
  console.log(data, 'data');
  return <div>{JSON.stringify(data)}</div>;
}
