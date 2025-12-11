'use client';
import { useSelector } from 'react-redux';
import { Stack } from '@mui/material';
import dynamic from 'next/dynamic';

// Dynamic imports for client-side widgets
const CartWidget = dynamic(() => import('src/components/cartWidget'), {
  loading: () => (
    <Stack direction="row" spacing={1} alignItems="center">
      {/* Skeleton for cart */}
    </Stack>
  )
});

const LanguageSelect = dynamic(() => import('src/components/languageSelect'), {
  ssr: false
});

const SettingMode = dynamic(() => import('src/components/settings/themeModeSetting'));

export default function NavbarClient() {
  const { checkout } = useSelector(({ product }) => product);

  return (
    <Stack gap={2} direction="row" alignItems="center">
      <LanguageSelect />
      <SettingMode />
      <CartWidget checkout={checkout} />
    </Stack>
  );
}
