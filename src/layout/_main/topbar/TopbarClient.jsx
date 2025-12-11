'use client';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { Stack, Divider, Skeleton } from '@mui/material';

const UserSelect = dynamic(() => import('src/components/select/userSelect'), {
  ssr: false,
  loading: () => (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Skeleton variant="rectangular" width={29.4} height={18.9} sx={{ borderRadius: '4px' }} />
      <Divider orientation="vertical" flexItem />
      <Skeleton variant="rectangular" width={48.4} height={18.9} sx={{ borderRadius: '4px' }} />
    </Stack>
  )
});

export default function TopbarClient() {
  const { user, isAuthenticated } = useSelector(({ user }) => user);

  return <UserSelect />;
}
