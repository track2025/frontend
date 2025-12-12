import * as React from 'react';
import Script from 'next/script';
import Providers from 'src/providers';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'simplebar-react/dist/simplebar.min.css';
import BootstrapInit from 'src/components/BootstrapInit';
import NextTopLoader from 'nextjs-toploader';

export const metadata = {
  metadataBase: new URL('https://lapsnaps.com')
  // ... other metadata
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang={'en-US'}>
      <head>
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

        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-QQMT8N4Q1N" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-QQMT8N4Q1N');
          `}
        </Script>
      </head>
      <body>
        <NextTopLoader
          color="#EE1E50"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #EE1E50,0 0 5px #EE1E50"
        />
        <BootstrapInit />
        {children}
      </body>
    </html>
  );
}
