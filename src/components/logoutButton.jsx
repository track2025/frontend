'use client';
import React, { useContext } from 'react';
import { useRouter } from 'next-nprogress-bar';
// redux
import { useDispatch, ReactReduxContext } from 'react-redux';
import { setLogout } from 'src/redux/slices/user';
// mui
import { LoadingButton } from '@mui/lab';
// hooks
import { deleteCookies } from 'src/hooks/cookies';
// icons
import { LuLogOut } from 'react-icons/lu';


export default function LogoutButton() {
  const router = useRouter();
  
  // Check if Redux is available
  const reduxContext = useContext(ReactReduxContext);
  const dispatch = reduxContext ? useDispatch() : null;

  const onLogout = () => {
    deleteCookies('token');
    deleteCookies('userRole');
    
    // Only dispatch if Redux is available
    if (dispatch) {
      dispatch(setLogout());
    } else {
      // On public routes, just clear cookies
      document.cookie = 'userData=; path=/; max-age=0';
      document.cookie = 'isAuthenticated=; path=/; max-age=0';
    }
    
    router.push('/auth/login');
  };

  return (
        <LoadingButton onClick={onLogout} variant="outlined" color="inherit" startIcon={<LuLogOut />} fullWidth>
          Logout
        </LoadingButton>
  );
}
