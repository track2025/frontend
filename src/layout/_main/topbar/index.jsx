'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useSelector } from 'react-redux';

// mui
import { Toolbar, Container, Stack, useTheme, Link, Divider, Skeleton, Typography } from '@mui/material';

// icons
import { MdOutlinePhone } from 'react-icons/md';
import { MdOutlineMail } from 'react-icons/md';

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

export default function UserTopbar() {
  const theme = useTheme();
  const { user, isAuthenticated } = useSelector(({ user }) => user);

  return (
    <Container maxWidth="xl">
      <Toolbar
        sx={{
          minHeight: `36px !important`,
          background: theme.palette.background.default,
          justifyContent: 'space-between',
          display: { xs: 'none', md: 'flex' },
          position: 'sticky',
          zIndex: 999,
          width: '100% !important',
          px: '0px!important',
          mx: '0px !important',
          left: '0px !important'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography sx={{ color: 'text.primary', fontSize: 14, display: 'flex', alignItems: 'center', gap: 1 }}>
            Welcome to Lap Snaps. high-quality photographs of vehicles
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <UserSelect />
          {!isAuthenticated && (
            <>
              <Divider orientation="vertical" flexItem />
              <Link component={NextLink} href={'/create-shop'} sx={{ color: 'text.primary', fontSize: 14 }}>
                Join as Photographer
              </Link>
            </>
          )}
        </Stack>
      </Toolbar>
    </Container>
  );
}
