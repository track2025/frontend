'use client';
// react
import React from 'react';
import PropTypes from 'prop-types';
// next

import { Toolbar, AppBar, Container } from '@mui/material';
import config from 'src/layout/_main/config.json';

import MenuDesktop from './menuDesktop';

// ----------------------------------------------------------------------
export default function Navbar({ data }) {
  const { menu } = config;
  // const dispatch = useDispatch();

  // const { data, isLoading } = useQuery(['get-categories-all'], () => api.getAllCategories());
  // React.useEffect(() => {
  // if (!isLoading) {
  // dispatch(setCategories(data));
  // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data]);

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
            <MenuDesktop navConfig={menu} data={data} isLoading={false} />
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
Navbar.propTypes = {
  isAuth: PropTypes.bool.isRequired
};
