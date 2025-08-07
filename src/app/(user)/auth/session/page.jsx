import React, { useEffect } from 'react';
// redux
import { useDispatch } from 'react-redux';
import { setLogout } from 'src/redux/slices/user';
import { resetWishlist } from 'src/redux/slices/wishlist';
// mui
import { Button } from '@mui/material';
// icons
import { LuLogOut } from 'react-icons/lu';
import { deleteCookies } from 'src/hooks/cookies';
import { useRouter } from 'next/router';

export default function Session() {
  const dispatch = useDispatch();
  const router = useRouter();

  const onLogout = () => {
    deleteCookies('token');
    dispatch(setLogout());
    dispatch(resetWishlist());
    router.push('/auth/login');
  };

  useEffect(() => {
    // Automatically logout when component mounts/lands
    onLogout();
  }, []);

  return (
    <>
      {/* You can keep this empty or add a loading state if needed */}
    </>
  );
}