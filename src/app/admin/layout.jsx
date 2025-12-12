import React from 'react';

// Prevent static generation - admin routes require authentication and use Redux
export const dynamic = 'force-dynamic';

// providers
import Providers from 'src/providers';

// guard
import AdminGuard from 'src/guards/admin';

// layout
import DashboardLayout from 'src/layout/_admin';

export default function layout({ children }) {
  return (
    <Providers>
      <AdminGuard>
        <DashboardLayout>{children}</DashboardLayout>
      </AdminGuard>
    </Providers>
  );
}
