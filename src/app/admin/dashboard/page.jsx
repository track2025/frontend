import React from 'react';

// components
import Dashboard from 'src/components/_admin/dashboard';

// Meta information
export const metadata = {
  title: 'Lap Snaps - Dashboard',
  description: 'Welcome to the Lap Snaps Dashboard. Manage your e-commerce operations with ease.',
  applicationName: 'Lap Snaps Dashboard',
  authors: 'Lap Snaps',
  keywords: 'dashboard, e-commerce, management, Lap Snaps',
  icons: {
    icon: '/favicon.png'
  }
};

export default function page() {
  return (
    <>
      <Dashboard />
    </>
  );
}
