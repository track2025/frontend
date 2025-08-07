import React from 'react';
import { useDispatch } from 'react-redux';
import { setLogout } from 'src/redux/slices/user';
import { resetWishlist } from 'src/redux/slices/wishlist';
import { deleteCookies } from 'src/hooks/cookies';
import { useRouter } from 'next/router';

function Session() {
  const dispatch = useDispatch();
  const router = useRouter();

  // This will run immediately when the component mounts on the client
  deleteCookies('token');
  dispatch(setLogout());
  dispatch(resetWishlist());
  router.push('/auth/login');

  return null; // Or a loading spinner if you prefer
}

// Export the component with no SSR
export default dynamic(() => Promise.resolve(Session), { ssr: false });