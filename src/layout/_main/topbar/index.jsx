'use client';
import React from 'react';
import dynamic from 'next/dynamic';
// redux
import { useSelector } from 'react-redux';
// mui
import { Toolbar, Typography, Stack, useTheme, Link, Divider, Skeleton } from '@mui/material';
import { LiaShippingFastSolid } from 'react-icons/lia';
import NextLink from 'next/link';
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
    <Toolbar
      sx={{
        minHeight: `36px !important`,
        background: theme.palette.background.default,
        justifyContent: 'space-between',
        display: { xs: 'none', md: 'flex' },
        position: 'sticky',
        top: 0,
        zIndex: 999,
        width: '100%'
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <LiaShippingFastSolid size={20} />
        <Typography variant="subtitle2">Free shipping and Returns on orders of $50+</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        {isAuthenticated ? (
          user.role === 'user' && (
            <>
              <Link
                component={NextLink}
                href={isAuthenticated ? '/create-shop' : '/auth/register?redirect=/create-shop'}
                sx={{ color: 'text.primary', fontSize: 14 }}
              >
                Become a seller
              </Link>
              <Divider orientation="vertical" flexItem />
            </>
          )
        ) : (
          <>
            <Link
              component={NextLink}
              href={isAuthenticated ? '/create-shop' : '/auth/register?redirect=/create-shop'}
              sx={{ color: 'text.primary', fontSize: 14 }}
            >
              Become a seller
            </Link>
            <Divider orientation="vertical" flexItem />
          </>
        )}

        <UserSelect />
      </Stack>
    </Toolbar>
  );
}
