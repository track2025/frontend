import React from 'react';
// redux
import { useDispatch } from 'react-redux';
import { setLogout } from 'src/redux/slices/user';
import { resetWishlist } from 'src/redux/slices/wishlist';
// mui
import {  Button } from '@mui/material';
// icons
import { LuLogOut } from 'react-icons/lu';

import { deleteCookies } from 'src/hooks/cookies';


export default function LogoutButton() {
  const dispatch = useDispatch();

  const onLogout = () => {
    deleteCookies('token');
    dispatch(setLogout());
    dispatch(resetWishlist());
    //setOpen(false);
    setTimeout(() => {
      location.href = '/auth/login';
    }, 1000);
  };

  return (
        <Button onClick={onLogout} variant="outlined" color="inherit" startIcon={<LuLogOut />} fullWidth>
          Logout
        </Button>
  );
}
