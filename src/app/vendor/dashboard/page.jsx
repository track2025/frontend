import React from 'react';

// components
import Dashboard from 'src/components/_admin/dashboard';

// Meta information
export const metadata = {
  title: 'RaceTrackRegistry - Dashboard',
  description: 'Welcome to the RaceTrackRegistry Dashboard. Manage your e-commerce operations with ease.',
  applicationName: 'RaceTrackRegistry Dashboard',
  authors: 'RaceTrackRegistry',
  keywords: 'dashboard, e-commerce, management, RaceTrackRegistry',
  icons: {
    icon: '/favicon.png'
  }
};

export default function page() {
  return (
    <>
      <Dashboard isVendor />
    </>
  );
}
