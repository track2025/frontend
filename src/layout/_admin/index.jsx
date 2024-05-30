'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
// mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// components
import DashboardAppbar from './topbar';
import DashboardSidebar from './sidebar';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from 'src/lib/redux/slices/settings';
import { useRouter } from 'next-nprogress-bar';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar
}));

export default function MiniDrawer({ children }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(({ user }) => user);
  const dispatch = useDispatch();
  const handleDrawerOpen = () => {
    setOpen(true);
    dispatch(toggleSidebar(true));
  };

  const handleDrawerClose = () => {
    setOpen(false);
    dispatch(toggleSidebar(false));
  };
  React.useEffect(() => {
    if (!isAuthenticated || !user?.role === 'super admin' || !user?.role === 'admin') {
      router.push('/auth/login');
    }
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <DashboardAppbar open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />

      <DashboardSidebar handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} open={open} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, position: 'relative', overflow: 'hidden' }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
MiniDrawer.propTypes = {
  children: PropTypes.node.isRequired
};
