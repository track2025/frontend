'use client';
import React from 'react';
import * as api from 'src/services';
import { useQuery } from 'react-query';

export default function page({ params: { pid } }) {
  const { data, isLoading } = useQuery(['shop-payment'], () => api.getIncomeDetailsByAdmin(pid), {
    onError: (err) => toast.error(err.response.data.message || 'Something went wrong!')
  });
  console.log(data);
  return <div>page</div>;
}
