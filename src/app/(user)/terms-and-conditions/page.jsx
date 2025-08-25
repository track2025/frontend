// pages/terms-and-conditions.js

import React from 'react';

// mui
import { Container, Typography } from '@mui/material';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
const TermsAndConditions = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <HeaderBreadcrumbs
        heading="Terms and conditions"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Terms and conditions'
          }
        ]}
      />
      <Typography variant="h3" component="h1" gutterBottom pt={3}>
        Terms and Conditions
      </Typography>
      <Typography variant="body1" paragraph>
       Last Updated: 14/08/2025
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom>
       1. Introduction
      </Typography>
      <Typography variant="body1" paragraph>
        These Terms and Conditions govern your use of lapsnaps.com operated by FB Ecom LTD and or lapsnaps.com, registered in the United Kingdom. By accessing or using the Website, you agree to these Terms. If you do not agree, you must not use the Website.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
       2. Our Role
      </Typography>
      <Typography variant="body1" paragraph>
        LapSnaps is an online platform that connects photographers and videographers with customers who wish to purchase a licence to use media from automotive events. We act as an intermediary. We are not the owner of the media sold unless explicitly stated and do not verify the accuracy or quality of uploaded media.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
       3. Account Registration
      </Typography>
      <Typography variant="body1" paragraph>
        You must create an account to upload, purchase, or download media. You must provide accurate information and keep it updated. You are responsible for maintaining the confidentiality of your account login details. If you are under 18, you confirm that you have obtained parental or guardian consent to use the Website and to receive payments.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
       4. Media Upload & Creator Obligations
      </Typography>
      <Typography variant="body1" paragraph>
       By uploading media to LapSnaps, you confirm you own all necessary rights to the media. You confirm the media does not infringe copyright, trademarks, or privacy rights. You confirm the media does not contain illegal, offensive, or defamatory content. You grant FB Ecom LTD and or lapsnaps.com a worldwide, royalty free, non exclusive licence to use, reproduce, display, and distribute your media for the purpose of marketing, promoting, and operating LapSnaps, without further payment to you. You acknowledge that uploaded media will be stored on our servers for 1 month and may be deleted after this period.

      </Typography>


      <Typography variant="h6" component="h2" gutterBottom>
       5. Purchases & Licensing
      </Typography>
      <Typography variant="body1" paragraph>
        Buyers purchase a limited, non exclusive, non transferable licence to use the purchased media for personal, non commercial purposes unless otherwise stated in writing by the Creator. Buyers do not acquire ownership of the media. Redistribution, resale, or commercial use is prohibited without explicit permission from the Creator.
      </Typography>


      <Typography variant="h6" component="h2" gutterBottom>
       6. Pricing & Payments
      </Typography>
      <Typography variant="body1" paragraph>
        Media prices are set by the Creator. Digital sales are subject to a platform fee of 30 percent. Seventy percent goes to the Creator and thirty percent to LapSnaps. Where applicable, Value Added Tax or other sales taxes may be charged in accordance with the laws of the Buyer’s country and will be added to the item price at checkout. All transactions and payments to Creators are processed in Great British Pounds. If you are located outside the United Kingdom, currency conversion may apply and your payment provider may charge additional fees. Payments to Creators are made via the payment method linked to their account, subject to any applicable processing fees and tax withholding requirements.
      </Typography>



      <Typography variant="h6" component="h2" gutterBottom>
       7. Refunds
      </Typography>
      <Typography variant="body1" paragraph>
        Refunds are only issued if the purchased file is corrupted or cannot be accessed, or if the media is materially different from its description.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
       8. Content Removal
      </Typography>
      <Typography variant="body1" paragraph>
        We reserve the right to remove media or suspend accounts that breach these Terms or applicable law.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
       9. Limitation of Liability
      </Typography>
      <Typography variant="body1" paragraph>
        We are not liable for the accuracy, legality, or quality of media uploaded by Creators. We are not liable for any indirect, incidental, or consequential losses arising from use of the Website.
      </Typography>


      <Typography variant="h6" component="h2" gutterBottom>
       10. Indemnity
      </Typography>
      <Typography variant="body1" paragraph>
        Creators agree to indemnify and hold harmless FB Ecom LTD and or lapsnaps.com from any claims, damages, or legal costs arising from their uploaded media or conduct on the Website.
      </Typography>

      


      <Typography variant="h6" component="h2" gutterBottom>
       11. Non-Compete & Non-Solicitation
      </Typography>
      <Typography variant="body1" paragraph>
        For a period of 12 months following the termination or cancellation of your Creator account with LapSnaps, you agree that you will not, without the prior written consent of FB Ecom LTD and or lapsnaps.com, upload, license, or sell the same or substantially similar media that you uploaded to LapSnaps to any competing online platform that sells automotive event media to the public. You also agree not to directly or indirectly solicit, approach, or conduct business with any Buyer you were introduced to through LapSnaps, for the purpose of selling them automotive event media outside of LapSnaps, and not to assist any competitor of LapSnaps in targeting or soliciting our Creators or Buyers. This clause is intended to protect our legitimate business interests, including our investment in marketing, platform development, and customer relationships.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
       12. Governing Law
      </Typography>
      <Typography variant="body1" paragraph>
        These Terms are governed by and interpreted under the laws of England and Wales. You agree that any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.
      </Typography>


      <Typography variant="h6" component="h2" gutterBottom>
       13. Changes to Terms
      </Typography>
      <Typography variant="body1" paragraph>
        We may update these Terms from time to time. Continued use of the Website after changes means you accept the updated Terms.
      </Typography>    
      
      </Container>
  );
};

export default TermsAndConditions;
