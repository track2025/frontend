'use client';
import { useContext } from 'react';
import { useSelector, ReactReduxContext } from 'react-redux';
import { useSettingsFromCookies } from 'src/hooks/useSettingsFromCookies';
import dynamic from 'next/dynamic';
import { Stack, Divider, Skeleton } from '@mui/material';

const UserSelect = dynamic(() => import('src/components/select/userSelect'), {
  loading: () => (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Skeleton variant="rectangular" width={29.4} height={18.9} sx={{ borderRadius: '4px' }} />
      <Divider orientation="vertical" flexItem />
      <Skeleton variant="rectangular" width={48.4} height={18.9} sx={{ borderRadius: '4px' }} />
    </Stack>
  )
});

export default function TopbarClient() {
  // Check if Redux is available
  const reduxContext = useContext(ReactReduxContext);
  
  // Get user data from Redux or cookies
  let user = null;
  let isAuthenticated = false;
  
  if (reduxContext) {
    const reduxUser = useSelector(({ user }) => user);
    user = reduxUser.user;
    isAuthenticated = reduxUser.isAuthenticated;
  } else {
    // Public route - get from cookies
    const cookieSettings = useSettingsFromCookies();
    user = cookieSettings.user;
    isAuthenticated = cookieSettings.isAuthenticated;
  }

  return <UserSelect />;
}
