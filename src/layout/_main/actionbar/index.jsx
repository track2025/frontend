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
  return (
    <>
      <AppBar
        sx={{
          boxShadow: 'none',
          position: 'sticky',
          top: 100,
          zIndex: 999,
          borderRadius: 0,
          //   pr: '0px !important',
          bgcolor: (theme) => theme.palette.primary.main,
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          display: { md: 'block', xs: 'none' }
        }}
      >
        <Toolbar disableGutters className="toolbar" sx={{ minHeight: '48px!important', px: 3, gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              boxShadow: 'none',
              borderRadius: 0,
              bgcolor: (theme) => alpha(theme.palette.common.black, 0.1)
              //   borderBottom: '2px solid #fff'
            }}
            startIcon={<RxDashboard />}
            // endIcon={<FaAngleDown fontSize={18} />}
          >
            Categories
          </Button>
          {/* categories={data?.data} */}
          <MenuDesktop navConfig={menu} />
        </Toolbar>
      </AppBar>
    </>
  );
}
Navbar.propTypes = {
  isAuth: PropTypes.bool.isRequired
};
