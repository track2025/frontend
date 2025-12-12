import React, { useContext } from 'react';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
// redux
import { useDispatch, ReactReduxContext } from 'react-redux';
import { setLogout } from 'src/redux/slices/user';
import { resetWishlist } from 'src/redux/slices/wishlist';
// mui
import { Typography, Divider, ListItemIcon, Button, MenuItem, Box } from '@mui/material';
// icons
import { LuLogOut } from 'react-icons/lu';
import { MdKey } from 'react-icons/md';
import { LiaFileInvoiceSolid } from 'react-icons/lia';
import { IoIosHeartEmpty } from 'react-icons/io';
import { LuLayoutDashboard } from 'react-icons/lu';
import { SlHome } from 'react-icons/sl';
import { TbUserSquareRounded } from 'react-icons/tb';
import { CiShop } from 'react-icons/ci';
import LogoutButton from 'src/components/logoutButton';

// styles
import RootStyled from './styled';
// hooks
import { deleteCookies } from 'src/hooks/cookies';

UserList.propTypes = {
  openUser: PropTypes.bool,
  user: PropTypes.object,
  setOpen: PropTypes.func
};

export default function UserList(props) {
  const { openUser, user, setOpen } = props;
  const router = useRouter();
  
  // Check if Redux is available
  const reduxContext = useContext(ReactReduxContext);
  const dispatch = reduxContext ? useDispatch() : null;

  const onLogout = () => {
    deleteCookies('token');
    deleteCookies('userRole');
    router.push('/auth/login');
    
    // Only dispatch if Redux is available
    if (dispatch) {
      dispatch(setLogout());
    } else {
      // On public routes, just clear cookies
      document.cookie = 'userData=; path=/; max-age=0';
      document.cookie = 'isAuthenticated=; path=/; max-age=0';
    }
  };

  return (
    <RootStyled autoFocusItem={openUser} id="composition-menu">
      <Box px={2}>
        <Typography variant="body1" color="text.primary" fontWeight={600} noWrap>
          {user?.firstName + ' ' + user?.lastName} {user?.role === 'admin' ? '( Admin )' : ''}
        </Typography>
        <Typography variant="body2" color="text.secondary" pb={1} noWrap>
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      <MenuItem
        className="menu-item"
        onClick={() => {
          router.push('/');
          setOpen(false);
        }}
      >
        <ListItemIcon className="menu-icon">
          <SlHome />
        </ListItemIcon>
        Home
      </MenuItem>
      {user?.role === 'admin' || user?.role === 'super admin' ? (
        <MenuItem
          onClick={() => {
            router.push('/admin/dashboard');
            setOpen(false);
          }}
        >
          <ListItemIcon className="menu-icon">
            <LuLayoutDashboard />
          </ListItemIcon>
          Admin Dashboard
        </MenuItem>
      ) : (
        user?.role === 'vendor' && (
          <MenuItem
            onClick={() => {
              router.push('/vendor/dashboard');
              setOpen(false);
            }}
          >
            <ListItemIcon className="menu-icon">
              <LuLayoutDashboard />
            </ListItemIcon>
            Vendor Dashboard
          </MenuItem>
        )
      )}
      <MenuItem
        onClick={() => {
          setOpen(false);
          router.push('/profile/wishlist');
        }}
      >
        <ListItemIcon className="menu-icon">
          <IoIosHeartEmpty />
        </ListItemIcon>
        Wishlist
      </MenuItem>
      <MenuItem
        onClick={() => {
          setOpen(false);
          router.push('/profile/orders');
        }}
      >
        <ListItemIcon className="menu-icon">
          <LiaFileInvoiceSolid />
        </ListItemIcon>
        Orders
      </MenuItem>
      <MenuItem
        onClick={() => {
          setOpen(false);
          router.push(
            user.role === 'admin' || user.role === 'super admin'
              ? '/admin/settings'
              : user.role === 'vendor'
                ? '/vendor/settings'
                : '/profile/general'
          );
        }}
      >
        <ListItemIcon className="menu-icon">
          <TbUserSquareRounded />
        </ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem
        onClick={() => {
          setOpen(false);
          router.push(
            user.role === 'admin' || user.role === 'super admin'
              ? '/admin/settings/change-password'
              : user.role === 'vendor'
                ? '/vendor/settings/change-password'
                : '/profile/change-password'
          );
        }}
      >
        <ListItemIcon className="menu-icon">
          <MdKey />
        </ListItemIcon>
        Change Password
      </MenuItem>
      <Box px={2} mt={1}>
        <LogoutButton />
      </Box>
    </RootStyled>
  );
}
