'use client';
import { Container } from '@mui/material';
import React, { useEffect } from 'react';
import ShopForm from 'src/components/forms/user-shop';
import { useSelector } from 'react-redux';
import { useRouter } from 'src/hooks/useRouter';
export default function Page() {
  const { user } = useSelector((state) => state.user);
  const router = useRouter();
  useEffect(() => {
    if (user?.role === 'vendor' || user?.role?.includes('admin')) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container fixed>
      <ShopForm />
    </Container>
  );
}
