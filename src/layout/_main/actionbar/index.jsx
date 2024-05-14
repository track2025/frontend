'use client';
// react
import React from 'react';
import PropTypes from 'prop-types';
// next
import dynamic from 'next/dynamic';
// mui

import { Toolbar, Stack, AppBar, Skeleton } from '@mui/material';
import config from 'src/layout/_main/config.json';
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setCategories } from 'src/lib/redux/slices/categories';
const Skeletons = () => {
  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
      <Skeleton variant="rectangular" width={280} height={48} />
      <Stack direction="row" spacing={2}>
        <Skeleton variant="rounded" width={38.3} height={22} />
        <Skeleton variant="rounded" width={89} height={22} />
        <Skeleton variant="rounded" width={56} height={22} />
        <Skeleton variant="rounded" width={27.4} height={22} />
        <Skeleton variant="rounded" width={48.6} height={22} />
        <Skeleton variant="rounded" width={26.8} height={22} />
      </Stack>
    </Stack>
  );
};
const MenuDesktop = dynamic(() => import('./menuDesktop'), {
  ssr: false,
  loading: () => <Skeletons />
});

// ----------------------------------------------------------------------
export default function Navbar({}) {
  const { menu } = config;
  const dispatch = useDispatch();

  const { data, isLoading } = useQuery(['get-categories-all'], () => api.getAllCategories());
  React.useEffect(() => {
    if (!isLoading) {
      dispatch(setCategories(data?.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <AppBar
        sx={{
          boxShadow: 'none',
          position: 'sticky',
          top: 80,
          zIndex: 999,
          borderRadius: 0,
          bgcolor: (theme) => theme.palette.primary.main,
          display: { md: 'flex', xs: 'none' },
          pr: '0px !important'
        }}
      >
        <Toolbar className="toolbar" sx={{ minHeight: '48px!important' }}>
          <MenuDesktop navConfig={menu} data={data?.data} isLoading={isLoading} />
        </Toolbar>
      </AppBar>
    </>
  );
}
Navbar.propTypes = {
  isAuth: PropTypes.bool.isRequired
};
