import * as React from 'react';
import Providers from 'src/providers';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'simplebar-react/dist/simplebar.min.css';
import BootstrapInit from 'src/components/BootstrapInit';

export default function RootLayout({ children }) {
  return (
    <html lang={'en-US'}>
      <body>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <BootstrapInit />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
