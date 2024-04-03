import * as React from 'react';
import Providers from 'src/lib/providers';
import { cookies } from 'next/headers';
export default async function RootLayout({ children }) {
  const cookiesList = cookies();
  const hasCookie = cookiesList.get('token');

  return (
    <html lang={'en-US'}>
      <body>
        <Providers isAuth={hasCookie}>{children}</Providers>
      </body>
    </html>
  );
}
