'use client';
import React from 'react';
import ShopForm from 'src/components/forms/user-shop';
import { Typography, Skeleton } from '@mui/material';
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next-nprogress-bar';
export default function ShopSettingMain() {
  const router = useRouter();
  const { data, isLoading } = useQuery(['get-shop-by-user'], () => api.getShopByUser(), {
    onSuccess: (res) => {
      if (res.data.status === 'approved') {
        toast.success('Welcome, Your shop is approved!');
        router.push('/vendor/dashboard');
      }
      if (res.data.status === 'not approved') {
        toast.error('apologize, Your shop is not approved!');
      }
      if (res.data.status === 'canceled') {
        toast.error('apologize, Your shop is not approved!');
      }
      if (res.data.status === 'closed') {
        toast.error('Welcome, Your shop is closed!');
      }
    },

    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong!');
      router.push('/');
    }
  });

  return (
    <div>
      <Typography variant="h2" color="text-primary" textAlign="center" py={6}>
        {isLoading ? (
          <Skeleton variant="text" width={280} sx={{ mx: 'auto' }} />
        ) : data?.data ? (
          'Update shop'
        ) : (
          'Create Shop'
        )}
      </Typography>
      <ShopForm data={data?.data} isLoading={isLoading} />
    </div>
  );
}
