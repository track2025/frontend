// pages/return-policy.js

import React from 'react';

// mui
import { Container, Typography } from '@mui/material';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

export const metadata = {
  title: 'Return & Refund Policy – Lap Snaps',
  description: 'Learn about Lap Snaps’ return and refund policies.',
  robots: {
    index: false
  },
  alternates: {
    canonical: 'https://lapsnaps.com/return-policy'
  },
  openGraph: {
    title: 'Return & Refund Policy – Lap Snaps',
    description: 'Learn about Lap Snaps’ return and refund policies.',
    url: 'https://lapsnaps.com/return-policy',
    type: 'website'
  }
};

const ReturnPolicy = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <HeaderBreadcrumbs
        heading="Return & Refund Policy"
        links={[
          { name: 'Home', href: '/' },
          { name: 'Return & Refund Policy' }
        ]}
      />

      <Typography variant="h3" component="h1" gutterBottom pt={3}>
        Return & Refund Policy
      </Typography>

      <Typography variant="body1" paragraph>
        Last Updated: 14/08/2025
      </Typography>

      {/* 1. Introduction */}
      <Typography variant="h6" component="h2" gutterBottom>
        1. Introduction
      </Typography>
      <Typography variant="body1" paragraph>
        This Return & Refund Policy outlines how returns and refunds are handled by FB
        Ecom LTD and/or LapSnaps.com (“we”, “us”, or “our”). By purchasing from
        LapSnaps, you agree to the terms set out in this policy.
      </Typography>

      {/* 2. Eligibility */}
      <Typography variant="h6" component="h2" gutterBottom>
        2. Eligibility for Returns (Physical Products Only)
      </Typography>
      <Typography variant="body1" paragraph>
        We accept returns only for eligible physical products purchased directly from
        lapsnaps.com. All digital items, downloadable media, customised content, and
        Creator uploads are strictly non-refundable, except where expressly stated in
        Section 5.
      </Typography>
      <Typography variant="body1" paragraph>
        To qualify for a physical product return:
      </Typography>
      <Typography variant="body1" component="ul" paragraph>
        <li>The item must be unused and in original condition.</li>
        <li>The item must include all original accessories and packaging.</li>
        <li>Your return request must be submitted within 14 days of delivery.</li>
      </Typography>

      {/* 3. Non Returnable */}
      <Typography variant="h6" component="h2" gutterBottom>
        3. Non-Returnable Items
      </Typography>
      <Typography variant="body1" paragraph>
        The following items cannot be returned or refunded:
      </Typography>
      <Typography variant="body1" component="ul" paragraph>
        <li>Digital files or downloadable media</li>
        <li>Customised or personalised content</li>
        <li>Creator-uploaded digital content</li>
        <li>Items marked as “final sale”</li>
      </Typography>

      {/* 4. Return Process */}
      <Typography variant="h6" component="h2" gutterBottom>
        4. Return Process (Physical Products Only)
      </Typography>
      <Typography variant="body1" paragraph>
        To initiate a return, contact us with your order number, reason for return,
        and supporting photos (if the item is damaged or incorrect). Once approved,
        return instructions will be provided. Returned items must be shipped within
        7 days of approval.
      </Typography>

      {/* 5. Digital Media */}
      <Typography variant="h6" component="h2" gutterBottom>
        5. Digital Media — No Refunds (Limited Exceptions Only)
      </Typography>
      <Typography variant="body1" paragraph>
        All purchases of digital media, photography, and video files are final and
        non-refundable once access, download, or viewing has been provided.
      </Typography>
      <Typography variant="body1" paragraph>
        Refunds for digital media are issued only if:
      </Typography>
      <Typography variant="body1" component="ul" paragraph>
        <li>The purchased file is corrupted;</li>
        <li>The file cannot be accessed or downloaded; or</li>
        <li>The media is materially different from its description.</li>
      </Typography>
      <Typography variant="body1" paragraph>
        No refunds will be given for change of mind, accidental purchases,
        dissatisfaction with content, user error, or device incompatibility.
      </Typography>

      {/* 6. Refunds */}
      <Typography variant="h6" component="h2" gutterBottom>
        6. Refunds (Physical Products Only)
      </Typography>
      <Typography variant="body1" paragraph>
        Refunds for approved physical returns are issued to the original payment
        method after inspection. Processing takes 5–10 working days depending on
        your bank. Shipping fees are non-refundable unless the return is due to our
        error.
      </Typography>

      {/* 7. Exchanges */}
      <Typography variant="h6" component="h2" gutterBottom>
        7. Exchanges
      </Typography>
      <Typography variant="body1" paragraph>
        If you receive a defective or incorrect physical item, we will replace it at no
        additional cost, subject to availability.
      </Typography>

      {/* 8. Damaged */}
      <Typography variant="h6" component="h2" gutterBottom>
        8. Damaged or Faulty Physical Items
      </Typography>
      <Typography variant="body1" paragraph>
        If a physical item arrives damaged or faulty, notify us within 48 hours of
        delivery with clear photos of the item and packaging. We will arrange a
        replacement or refund where applicable.
      </Typography>

      {/* 9. Shipping Costs */}
      <Typography variant="h6" component="h2" gutterBottom>
        9. Shipping Costs
      </Typography>
      <Typography variant="body1" paragraph>
        Customers are responsible for return shipping costs unless:
      </Typography>
      <Typography variant="body1" component="ul" paragraph>
        <li>We sent the wrong item;</li>
        <li>The item arrived damaged; or</li>
        <li>The item is defective.</li>
      </Typography>

      {/* 10. Contact */}
      <Typography variant="h6" component="h2" gutterBottom>
        10. Contact Details
      </Typography>
      <Typography variant="body1" paragraph>
        For all return, refund, or exchange enquiries, please contact us at
        <strong> info@lapsnaps.com</strong>. We aim to respond within 1–3 working days.
      </Typography>

      {/* 11. Changes */}
      <Typography variant="h6" component="h2" gutterBottom>
        11. Changes to This Policy
      </Typography>
      <Typography variant="body1" paragraph>
        We may update this policy at any time. The latest version will always be
        available on this page with an updated “Last Updated” date.
      </Typography>

      {/* 12. Third-party Disclosure */}
      <Typography variant="h6" component="h2" gutterBottom>
        12. Third-Party Fulfilment Disclosure
      </Typography>
      <Typography variant="body1" paragraph>
        Some physical products sold on LapSnaps may be fulfilled and shipped by
        independent third-party suppliers. These suppliers are responsible for
        dispatch, packaging, and delivery logistics. LapSnaps does not manufacture,
        inspect, or physically handle third-party fulfilled items. Delivery times may
        vary based on supplier location, and packaging or branding may differ.
      </Typography>

      <Typography variant="body1" paragraph>
        LapSnaps remains responsible for processing approved refunds and returns
        in accordance with this policy, but is not liable for delays caused by
        third-party carriers, customs clearance, supplier failure, or events outside
        our control.
      </Typography>
    </Container>
  );
};

export default ReturnPolicy;
