// pages/privacy-policy.js

import React from 'react';

// mui
import { Container, Typography } from '@mui/material';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <HeaderBreadcrumbs
        heading="Privacy policy"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Privacy policy'
          }
        ]}
      />
      <Typography variant="h3" component="h1" gutterBottom pt={3}>
        Privacy Policy
      </Typography>
      <Typography variant="body1" paragraph>
       Last Updated: 14/08/2025
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom>
       1. Introduction
      </Typography>
      <Typography variant="body1" paragraph>
        This Privacy Policy explains how FB Ecom LTD and/or lapsnaps.com (“we”, “us”, or “our”) collects, uses, and protects your personal data when you use lapsnaps.com (“Website”). We are committed to complying with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and the Privacy and Electronic Communications Regulations (PECR). By using our Website, you agree to the terms of this Privacy Policy.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
       2. Data We Collect
      </Typography>
      <Typography variant="body1" paragraph>
        We may collect the following types of personal data: account information such as name, email address, and login details; payment details processed securely by our payment providers (we do not store full payment card details); uploaded media metadata including event details and descriptive tags; and technical information such as IP address, browser type, device type, and cookies.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
       3. How We Use Your Data
      </Typography>
      <Typography variant="body1" paragraph>
        We use your personal data to provide and operate our services, process transactions and send payment to Creators, communicate with you including sending important service updates, prevent fraud and ensure platform security, and comply with legal obligations.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
       4. Legal Bases for Processing
      </Typography>
      <Typography variant="body1" paragraph>
        We process personal data under the following lawful bases: performance of a contract, compliance with a legal obligation, legitimate interests such as platform security and fraud prevention, and consent for email marketing or non-essential cookies.
      </Typography>


      <Typography variant="h6" component="h2" gutterBottom>
       5. Marketing Communications
      </Typography>
      <Typography variant="body1" paragraph>
        We will only send you marketing communications if you have provided consent or if you are an existing customer and we are promoting similar products or services. You can opt out at any time by clicking the unsubscribe link in our emails.
      </Typography>


      <Typography variant="h6" component="h2" gutterBottom>
       6. Cookies and Tracking Technologies
      </Typography>
      <Typography variant="body1" paragraph>
        We use essential cookies for site functionality and, with your consent, analytics and marketing cookies. You can manage cookie preferences via your browser settings or our cookie banner in compliance with PECR.
      </Typography>



      <Typography variant="h6" component="h2" gutterBottom>
       7. Data Sharing
      </Typography>
      <Typography variant="body1" paragraph>
        We may share your personal data with payment processors for transaction handling, IT and hosting providers for platform operation, and law enforcement or regulatory authorities when required by law. We do not sell your personal data to third parties.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
       8. International Data Transfers
      </Typography>
      <Typography variant="body1" paragraph>
        If we transfer your data outside the UK, we ensure appropriate safeguards are in place, such as adequacy decisions or approved contractual clauses.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
       9. Data Retention
      </Typography>
      <Typography variant="body1" paragraph>
        We keep your personal data only as long as necessary to fulfil the purposes for which it was collected or to comply with legal obligations. Uploaded media is stored for 1 month for Creators before deletion.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
       10. Your Rights
      </Typography>
      <Typography variant="body1" paragraph>
        Under UK GDPR, you have the right to access, correct, delete, restrict, or object to the processing of your personal data, and the right to data portability. You also have the right to withdraw consent where processing is based on consent. To exercise these rights, contact us using the details below.
      </Typography>


      <Typography variant="h6" component="h2" gutterBottom>
       11. Data Security
      </Typography>
      <Typography variant="body1" paragraph>
        We use SSL encryption and other security measures to protect your data. However, no method of transmission over the internet is completely secure.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
       12. Contact Details
      </Typography>
      <Typography variant="body1" paragraph>
        If you have any questions about this Privacy Policy or your data, please contact us.    
You also have the right to lodge a complaint with the Information Commissioner’s Office (ICO) at ico.org.uk.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
       13. Changes to This Policy
      </Typography>
      <Typography variant="body1" paragraph>
        We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised “last Updated” date.
      </Typography>
    </Container>
  );
};

export default PrivacyPolicy;
