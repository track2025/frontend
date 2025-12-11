import React from 'react';
import { Button } from '@mui/material';

// mui
import { alpha } from '@mui/material/styles';
import { Toolbar, Stack, AppBar, Box, Container } from '@mui/material';

// components
import Logo from 'src/components/logo';
import MenuDesktop from '../actionbar/menuDesktop';
import NavbarClient from './NavbarClient';
import MobileBarClient from './MobileBarClient';
import config from 'src/layout/_main/config.json';

// ----------------------------------------------------------------------
export default function Navbar() {
  const { menu } = config;

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
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'divider',
          '& .toolbar': {
            justifyContent: 'space-between',
            backdropFilter: 'blur(6px)',
            borderRadius: 0,
            WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
            bgcolor: 'background.paper',
            px: 3,
            py: 1.5
          }
        }}
      >
        <Container maxWidth="xl" className="">
          <Toolbar disableGutters className="toolbar bg-none" sx={{ px: '0px!important' }}>
            <Stack gap={4} direction="row" alignItems={'center'}>
              <Logo />
            </Stack>
            <Stack gap={4} direction="row" alignItems={'center'} sx={{ display: { md: 'flex', xs: 'none' } }}>
              <MenuDesktop navConfig={menu} />
            </Stack>

            <Stack gap={2} direction="row" alignItems={'center'}>
              <Button
                className="text-nowrap"
                variant="contained"
                href="/track-products"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'background.paper',
                  textTransform: 'none',
                  display: { xs: 'none', md: 'inline-flex' },
                  '&:hover': {
                    bgcolor: 'text.primary',
                    opacity: 0.9,
                  },
                }}
              >
                Race Store
              </Button>

              <NavbarClient />
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile bar - hidden on desktop via CSS */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <MobileBarClient />
      </Box>
    </>
  );
}

