'use client'; // Mark as Client Component

import { useDispatch } from 'react-redux';
import { setLogout } from 'src/redux/slices/user';
import { resetWishlist } from 'src/redux/slices/wishlist';
import { deleteCookies } from 'src/hooks/cookies';
import { redirect } from 'next/navigation';

export default function SessionPage() {
  const dispatch = useDispatch();

  // Perform logout actions
  deleteCookies('token');
  dispatch(setLogout());
  dispatch(resetWishlist());
  
  // Redirect immediately
  redirect('/auth/login');

  // This won't actually render as redirect will interrupt
  return null;
}