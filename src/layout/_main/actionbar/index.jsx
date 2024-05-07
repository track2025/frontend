'use client';
// react
import React from 'react';
import PropTypes from 'prop-types';
// next
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
// mui
import { alpha } from '@mui/material/styles';
import { Toolbar, Stack, AppBar, Button, Skeleton } from '@mui/material';
import { RxDashboard } from 'react-icons/rx';
import { FaAngleDown } from 'react-icons/fa6';
import config from 'src/layout/_main/config.json';
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
const Skeletons = () => {
  return (
    <Stack direction="row" gap={2}>
      <Skeleton variant="rounded" width={38.3} height={22} />
      <Skeleton variant="rounded" width={89} height={22} />
      <Skeleton variant="rounded" width={56} height={22} />
      <Skeleton variant="rounded" width={27.4} height={22} />
      <Skeleton variant="rounded" width={48.6} height={22} />
      <Skeleton variant="rounded" width={26.8} height={22} />
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

  const { data, isLoading } = useQuery(['get-categories-all'], () => api.getAllCategories());
  console.log(data, 'data');
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
          display: { md: 'flex', xs: 'none' }
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
