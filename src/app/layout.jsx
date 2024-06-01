import * as React from 'react';
import Providers from 'src/providers';
export default function RootLayout({ children }) {
  return (
    <html lang={'en-US'}>
      <body>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
