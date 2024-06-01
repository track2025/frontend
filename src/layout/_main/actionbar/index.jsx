'use client';
// react
import React from 'react';
import PropTypes from 'prop-types';
// next

import { Toolbar, AppBar, Container } from '@mui/material';
import config from 'src/layout/_main/config.json';

import MenuDesktop from './menuDesktop';

// ----------------------------------------------------------------------
export default function Navbar() {
  const { menu } = config;

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
        <Container maxWidth="xl">
          <Toolbar className="toolbar" sx={{ minHeight: '48px!important', px: '0px!important' }}>
            <MenuDesktop navConfig={menu} />
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
Navbar.propTypes = {
  isAuth: PropTypes.bool.isRequired
};
