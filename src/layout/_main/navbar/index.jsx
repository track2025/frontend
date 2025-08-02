'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@mui/material';

// mui
import { alpha } from '@mui/material/styles';
import { Toolbar, Skeleton, Stack, AppBar, useMediaQuery, Box, Container } from '@mui/material';

// components
import Logo from 'src/components/logo';
import MenuDesktop from '../actionbar/menuDesktop';
import config from 'src/layout/_main/config.json';
import LogoutButton from 'src/components/logoutButton';



// dynamic import components
const MobileBar = dynamic(() => import('src/layout/_main/mobileBar'));
const SettingMode = dynamic(() => import('src/components/settings/themeModeSetting'), {
  loading: () => <Skeleton variant="circular" width={40} height={40} />
});
const WishlistPopover = dynamic(() => import('src/components/popover/wislist'), {
  loading: () => (
    <Stack direction="row" spacing={1} alignItems="center">
      <Skeleton variant="circular" width={40} height={40} />
      <Box>
        <Skeleton variant="text" width={60} sx={{ mb: 0.6 }} />
        <Skeleton variant="text" width={60} />
      </Box>
    </Stack>
  )
});
const CartWidget = dynamic(() => import('src/components/cartWidget'), {
  loading: () => (
    <Stack direction="row" spacing={1} alignItems="center" >
      <Skeleton variant="circular" width={40} height={40} />
      <Box>
        <Skeleton variant="text" width={60} sx={{ mb: 0.6 }} />
        <Skeleton variant="text" width={60} />
      </Box>
    </Stack>
  )
});

const CompareWidget = dynamic(() => import('src/components/compareWidget'), {
  loading: () => (
    <Stack direction="row" spacing={1} alignItems="center">
      <Skeleton variant="circular" width={40} height={40} />
      <Box>
        <Skeleton variant="text" width={60} sx={{ mb: 0.6 }} />
        <Skeleton variant="text" width={60} />
      </Box>
    </Stack>
  )
});
const Search = dynamic(() => import('src/components/dialog/search/new'), {
  srr: false,
  loading: () => <Skeleton variant="rounded" width={300} height={56} sx={{ borderRadius: '70px' }} />
});
const LanguageSelect = dynamic(() => import('src/components/languageSelect'), {
  ssr: false,
  loading: () => <Skeleton variant="circular" width={40} height={40} />
});

// ----------------------------------------------------------------------
export default function Navbar() {
  const { checkout } = useSelector(({ product }) => product);
  const { user, isAuthenticated } = useSelector(({ user }) => user);
  
  const isMobile = useMediaQuery('(max-width:768px)');
  const { menu } = config;
  const pathname = usePathname();
const isHome = pathname === '/';

  // Scroll listener: only attach if on home page
  
  return (
    <>
 <AppBar
        sx={{
          boxShadow: 'none',
          position: 'sticky',
          top: -0.5,
          zIndex: 999,
          borderRadius: 0,
          pr: '0px !important',
          bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          '& .toolbar': {
            justifyContent: 'space-between',
            backdropFilter: 'blur(6px)',
            borderRadius: 0,
            WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
            bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
            px: 3,
            py: 1.5
          }
        }}
      >
        <Container maxWidth="xl" className=''>
          <Toolbar disableGutters className="toolbar bg-none" sx={{ px: '0px!important' }}>
            <Stack gap={4} direction="row" alignItems={'center'}>
              <Logo />
            </Stack>
            <Stack gap={4} direction="row" alignItems={'center'} sx={{ display: { md: 'block', xs: 'none' }
}}>
                <MenuDesktop navConfig={menu} />
                 { !isAuthenticated && <Button
                className='text-nowrap'
                  variant="contained"
                  href="/auth/login"
                  sx={{
                    bgcolor: 'text.primary',
                    color: 'background.paper',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'text.primary', // keeps color consistent on hover
                      opacity: 0.9
                    }
                  }}
                >
                  Sign In
                </Button> 
                }
            </Stack>

            <Stack gap={2} direction="row" alignItems={'center'}>

              <LanguageSelect />
              <SettingMode  />
              {/* <WishlistPopover />
              <CompareWidget /> */}
              <CartWidget checkout={checkout}  />
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>


      {isMobile && <MobileBar />}
    </>

      
  );
}
