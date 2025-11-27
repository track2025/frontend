// pages/return-policy.js

import React from 'react';

// mui
import { Container, Typography } from '@mui/material';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

export const metadata = {
  title: 'Return Policy – Lap Snaps',
  description: 'Learn about Lap Snaps’ return, refund, and exchange policies.',
  robots: {
    index: false
  },
  alternates: {
    canonical: 'https://lapsnaps.com/return-policy'
  },
  openGraph: {
    title: 'Return Policy – Lap Snaps',
    description: 'Learn about Lap Snaps’ return, refund, and exchange policies.',
    url: 'https://lapsnaps.com/return-policy',
    type: 'website'
  }
};

const ReturnPolicy = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <HeaderBreadcrumbs
        heading="Return Policy"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Return Policy'
          }
        ]}
      />

      <Typography variant="h3" component="h1" gutterBottom pt={3}>
        Return Policy
      </Typography>

      <Typography variant="body1" paragraph>
        Last Updated: 14/08/2025
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
        1. Introduction
      </Typography>
      <Typography variant="body1" paragraph>
        This Return Policy outlines how returns, refunds, and exchanges are handled 
        by FB Ecom LTD and/or lapsnaps.com (“we”, “us”, or “our”). By purchasing 
        from Lap Snaps, you agree to the terms set out in this policy.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
        2. Eligibility for Returns
      </Typography>
      <Typography variant="body1" paragraph>
        We accept returns only for eligible physical products purchased directly 
        from lapsnaps.com. Digital items, customised content, downloadable media, 
        and Creator uploads are non-refundable due to their nature.
      </Typography>

      <Typography variant="body1" paragraph>
        To qualify for a return:
      </Typography>
      <Typography variant="body1" component="ul" paragraph>
        <li>The item must be unused and in its original condition.</li>
        <li>The item must include all original packaging and accessories.</li>
        <li>A return request must be submitted within 14 days of delivery.</li>
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
        3. Non-Returnable Items
      </Typography>
      <Typography variant="body1" paragraph>
        The following items cannot be returned:
      </Typography>
      <Typography variant="body1" component="ul" paragraph>
        <li>Digital files or downloadable content</li>
        <li>Customised or personalised items</li>
        <li>Products marked as “final sale”</li>
        <li>Services or subscription fees</li>
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
        4. Return Process
      </Typography>
      <Typography variant="body1" paragraph>
        To initiate a return, please contact us using the details below with your:
      </Typography>
      <Typography variant="body1" component="ul" paragraph>
        <li>Order number</li>
        <li>Reason for return</li>
        <li>Supporting photos (if the item is damaged or incorrect)</li>
      </Typography>

      <Typography variant="body1" paragraph>
        Once your request is reviewed, we will provide return instructions.  
        Returned items must be shipped within 7 days of receiving approval.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
        5. Refunds
      </Typography>
      <Typography variant="body1" paragraph>
        Refunds are issued to the original payment method once the returned 
        item is received and inspected. Refund processing typically takes 
        5–10 working days depending on your bank.
      </Typography>

      <Typography variant="body1" paragraph>
        Shipping fees are non-refundable unless the return is due to our error.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
        6. Exchanges
      </Typography>
      <Typography variant="body1" paragraph>
        If you received a defective or incorrect item, we will replace it at no 
        additional cost. Exchanges are subject to product availability.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
        7. Damaged or Faulty Items
      </Typography>
      <Typography variant="body1" paragraph>
        If your item arrives damaged or faulty, please notify us within 48 hours of delivery.  
        Include clear photos of the item and packaging. We will arrange a replacement or refund.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
        8. Shipping Costs
      </Typography>
      <Typography variant="body1" paragraph>
        Customers are responsible for return shipping costs unless:
      </Typography>

      <Typography variant="body1" component="ul" paragraph>
        <li>We sent the wrong item</li>
        <li>The item arrived damaged</li>
        <li>The item is defective</li>
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
        9. Contact Details
      </Typography>
      <Typography variant="body1" paragraph>
        If you have questions about returns, exchanges, or refunds, please contact us.
      </Typography>

      <Typography variant="body1" paragraph>
        We aim to respond within 1–3 working days.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
        10. Changes to This Policy
      </Typography>
      <Typography variant="body1" paragraph>
        We may update this Return Policy from time to time. The latest version will always be 
        available on this page with an updated “Last Updated” date.
      </Typography>
    </Container>
  );
};

export default ReturnPolicy;
