import React from 'react';
// guard
import VendorGuard from 'src/guards/vendor';
// layout
import VendorLayout from 'src/layout/_vendor';
import 'simplebar-react/dist/simplebar.min.css';

export default function layout({ children }) {
  return (
    <VendorGuard>
      <VendorLayout>{children}</VendorLayout>
    </VendorGuard>
  );
}
