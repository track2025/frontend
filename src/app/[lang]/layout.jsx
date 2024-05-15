import * as React from 'react';
import Providers from 'src/lib/providers';
import { cookies } from 'next/headers';
export default async function RootLayout({ children }) {
  const cookiesList = cookies();
  const hasCookie = cookiesList.get('token');

  return (
    <html lang={'en-US'}>
      <body>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Providers isAuth={hasCookie}>{children}</Providers>
      </body>
    </html>
  );
}
