import React from 'react';

// Prevent static generation - vendor routes require authentication and use Redux
export const dynamic = 'force-dynamic';

// providers
import Providers from 'src/providers';

// guard
import VendorGuard from 'src/guards/vendor';

// layout
import VendorLayout from 'src/layout/_vendor';

export default function layout({ children }) {
  return (
    <Providers>
      <VendorGuard>
        <VendorLayout>{children}</VendorLayout>
      </VendorGuard>
    </Providers>
  );
}
