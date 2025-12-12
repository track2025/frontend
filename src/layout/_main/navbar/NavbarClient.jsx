'use client';
import { useContext } from 'react';
import { useSelector, ReactReduxContext } from 'react-redux';
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

const LanguageSelect = dynamic(() => import('src/components/languageSelect'));

const SettingMode = dynamic(() => import('src/components/settings/themeModeSetting'));

export default function NavbarClient() {
  // Check if Redux is available
  const reduxContext = useContext(ReactReduxContext);
  
  // Get checkout data from Redux or use empty object for public routes
  let checkout = { cart: [] };
  
  if (reduxContext) {
    const productState = useSelector(({ product }) => product);
    checkout = productState.checkout;
  }

  return (
    <Stack gap={2} direction="row" alignItems="center">
      <LanguageSelect />
      {/* Only show SettingMode on Redux routes */}
      {reduxContext && <SettingMode />}
      <CartWidget checkout={checkout} />
    </Stack>
  );
}
