'use client';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next-nprogress-bar';
import { useDispatch, useSelector } from 'react-redux';
// mui
import { Typography, Skeleton } from '@mui/material';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

// components
import ShopForm from 'src/components/forms/shopSetting';
import { updateStatus } from 'src/redux/slices/user';
export default function ShopSettingMain() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { data, isLoading } = useQuery(['get-shop-by-user'], () => api.getShopByUser(), {
    onSuccess: (res) => {
      if (res.data) {
        if (res.data.status === 'approved') {
          toast.success("🎉 Welcome! Your shop has been approved — you're all set to start selling!");
          dispatch(updateStatus('vendor'));
          router.push('/vendor/dashboard');
        }
        if (res.data.status === 'not approved') {
          toast.error('Oops! Your shop isn’t approved yet. Don’t worry — Please contact our support team and we’ll guide you through the next steps.');
        }
        if (res.data.status === 'canceled') {
          toast.error('Oops! Your shop isn’t approved yet. Don’t worry — Please contact our support team and we’ll guide you through the next steps.');
        }
        if (res.data.status === 'closed') {
          toast.error('Your shop is currently closed. You can reopen it from your dashboard anytime');
        }
      }
    },

    onError: (err) => {
      toast.error(err.response.data.message || 'We ran into an issue. Please refresh the page or try again.');
      router.push('/');
    }
  });
  useEffect(() => {
    if (!user?.isVerified) {
      router.push('/');
      toast.error('Just one more step — check your inbox to verify your email!');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
