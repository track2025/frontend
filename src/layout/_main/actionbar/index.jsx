'use client';
import React from 'react';
import PropTypes from 'prop-types';

// mui
import { Toolbar, AppBar, Container } from '@mui/material';

// components
import MenuDesktop from './menuDesktop';
import config from 'src/layout/_main/config.json';

// ----------------------------------------------------------------------
export default function Navbar() {
  const { menu } = config;

  // return (
  //   <>
  //     <AppBar
  //       sx={{
  //         boxShadow: 'none',
  //         position: 'sticky',
  //         top: 80,
  //         zIndex: 999,
  //         borderRadius: 0,
  //         display: { md: 'flex', xs: 'none' },
  //         pr: '0px !important',
      
  //         // Apply blur and transparency
  //         backdropFilter: 'blur(10px) brightness(0.85)',
  //         WebkitBackdropFilter: 'blur(10px) brightness(0.85)',
  //         backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust alpha for desired tint
  //       }}
  //     >
  //       <Container maxWidth="xl">
  //         <Toolbar className="toolbar" sx={{ minHeight: '48px!important', px: '0px!important' }}>
  //           <MenuDesktop navConfig={menu} />
  //         </Toolbar>
  //       </Container>
  //     </AppBar>
  //   </>
  // );
}
Navbar.propTypes = {
  isAuth: PropTypes.bool.isRequired
};
