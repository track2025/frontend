'use client';
import React from 'react';
// mui
import { Toolbar, Typography, Stack, useTheme, Link, Divider } from '@mui/material';
import { LiaShippingFastSolid } from 'react-icons/lia';
import NextLink from 'next/link';
export default function UserTopbar() {
  const theme = useTheme();
  return (
    <Toolbar
      sx={{
        minHeight: `36px !important`,
        // background: theme.palette.mode === 'dark' ? 'background.paper' : '#000',
        // color: 'common.white',
        justifyContent: 'space-between',
        display: { xs: 'none', md: 'flex' }
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <LiaShippingFastSolid size={20} />
        <Typography variant="subtitle2">Free shipping and Returns on orders of $50+</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Link component={NextLink} href="/auth/login" sx={{ color: 'text.primary', fontSize: 14 }}>
          Login
        </Link>
        <Divider orientation="vertical" flexItem />

        <Link component={NextLink} href="/auth/register" sx={{ color: 'text.primary', fontSize: 14 }}>
          Register
        </Link>
        <Divider orientation="vertical" flexItem />

        <Link
          component={NextLink}
          href="/auth/register?redirect=/create-shop"
          sx={{ color: 'text.primary', fontSize: 14 }}
        >
          Become a seller
        </Link>
      </Stack>
    </Toolbar>
  );
}
