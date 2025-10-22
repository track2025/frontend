// import * as React from 'react';
// import Providers from 'src/providers';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'simplebar-react/dist/simplebar.min.css';
// import BootstrapInit from 'src/components/BootstrapInit';

// export default function RootLayout({ children }) {
//   return (
//     <html lang={'en-US'}>
//       <body>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <BootstrapInit />
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   );
// }

import * as React from 'react';
import Script from 'next/script';
import Providers from 'src/providers';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'simplebar-react/dist/simplebar.min.css';
import BootstrapInit from 'src/components/BootstrapInit';

export default function RootLayout({ children }) {
  return (
    <html lang={'en-US'}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Trust Payments JavaScript Library */}
        <Script
          src="https://cdn.eu.trustpayments.com/js/latest/st.js"
          strategy="afterInteractive"
          // onLoad={() => {
          //   console.log('[Trust Payments] st.js library loaded successfully');
          //   if (window.SecureTrading) {
          //     console.log('[Trust Payments] SecureTrading object available');
          //   }
          // }}
          // onError={(e) => {
          //   console.error('[Trust Payments] Failed to load st.js:', e);
          // }}
        />
      </head>
      <body>
        <BootstrapInit />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
