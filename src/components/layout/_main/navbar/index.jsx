'use client';
// react
import React from 'react';
import PropTypes from 'prop-types';
// next
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
// mui
import { alpha } from '@mui/material/styles';
import { Toolbar, Skeleton, Stack, AppBar, useMediaQuery } from '@mui/material';
// redux
import { useSelector } from 'react-redux';

// config
import config from 'src/components/layout/_main/config.json';
import MainLogo from 'src/components/mainLogo';
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
const MobileBar = dynamic(() => import('src/components/layout/_main/mobileBar'));

// dynamic import components
const SettingMode = dynamic(() => import('src/components/settings/themeModeSetting'), {
  loading: () => <Skeleton variant="circular" width={40} height={40} />
});
const WishlistPopover = dynamic(() => import('src/components/popover/wislist'), {
  loading: () => <Skeleton variant="circular" width={40} height={40} />
});
const CartWidget = dynamic(() => import('src/components/cartWidget'), {
  loading: () => <Skeleton variant="circular" width={40} height={40} />
});

const Search = dynamic(() => import('src/components/dialog/search'), {
  ssr: false,
  loading: () => <Skeleton variant="circular" width={40} height={40} />
});
// const UserSelect = dynamic(() => import('src/components/select/userSelect'), {
//   ssr: false,
//   loading: () => <Skeleton variant="circular" width={50} height={50} />
// });
const AdminDialog = dynamic(() => import('src/components/dialog/admin'));
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
export default function Navbar({ isAuth }) {
  const { menu } = config;
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { checkout } = useSelector(({ product }) => product);
  const isMobile = useMediaQuery('(max-width:768px)');

  const { data, isLoading } = useQuery(['get-categories-all'], () => api.getAllCategories());

  return (
    <>
      <AppBar
        sx={{
          boxShadow: 'none',
          position: 'fixed',
          top: 36,
          zIndex: 999,
          borderRadius: 0,
          pr: '0px !important',
          bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          display: { md: 'block', xs: 'none' },
          '& .toolbar': {
            justifyContent: 'space-between',
            backdropFilter: 'blur(6px)',
            borderRadius: 0,
            WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
            bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
            px: 3
          }
        }}
      >
        <Toolbar disableGutters className="toolbar">
          <Stack width={203}>
            <MainLogo />
          </Stack>
          {isLoading ? <Skeletons /> : <MenuDesktop isHome={isHome} navConfig={menu} categories={data?.data} />}

          <Stack gap={0.1} direction="row" alignItems={'center'}>
            <Search />

            <WishlistPopover isAuth={isAuth} />
            <SettingMode />
            <CartWidget checkout={checkout} />
            {/* <UserSelect /> */}
          </Stack>
        </Toolbar>
      </AppBar>
      {isMobile && <MobileBar />}
      {data?.adminPopup && <AdminDialog isOpen={data?.adminPopup} />}
    </>
  );
}
Navbar.propTypes = {
  isAuth: PropTypes.bool.isRequired
};
