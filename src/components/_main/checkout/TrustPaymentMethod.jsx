'use client';

import { useState } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import { Payment } from '@mui/icons-material';

/**
 * Trust Payment Button Component
 * Submits a form POST to Trust Payments hosted checkout
 *
 * @param {string|number} amount - Payment amount (e.g., "10.99" or 10.99)
 * @param {string} currency - Currency code (e.g., "GBP", "USD", "EUR")
 * @param {string} siteReference - Your Trust Payments site reference (REQUIRED)
 * @param {string} orderReference - Your order/transaction reference (optional)
 * @param {string} profile - Trust Payments profile to use (default: "default")
 * @param {string} domain - Trust Payments domain (default: production)
 * @param {string} journey - Payment journey: "choice" or "details" (default: "choice")
 * @param {string} successUrl - URL to redirect after successful payment
 * @param {string} errorUrl - URL to redirect after failed/declined payment
 * @param {object} userDetails - Customer billing details (optional)
 * @param {function} onSubmit - Callback fired when form is submitted
 */
const TrustPaymentButton = ({
  amount,
  currency = 'GBP',
  orderReference,
  // siteReference = 'test_fbecomltd143257',
  siteReference = 'fbecomltd143258',
  profile = 'default',
  domain = 'https://payments.securetrading.net',
  journey = 'choice', // 'choice' for multiple payment methods, 'details' for card only
  successUrl = 'https://lapsnaps.com/checkout',
  errorUrl,
  userDetails = {},
  disabled = false,
  onSubmit
}) => {
  const [error, setError] = useState(null);

  const handlePayment = () => {
    // Validate required fields
    if (!amount) {
      const errorMsg = 'Payment amount is required';
      console.error('[Trust Payments]', errorMsg);
      setError(errorMsg);
      return;
    }

    if (!siteReference) {
      const errorMsg = 'Site reference is required (obtain from Trust Payments account)';
      console.error('[Trust Payments]', errorMsg);
      setError(errorMsg);
      return;
    }

    setError(null);

    try {
      // console.log('[Trust Payments] Submitting payment form:', {
      //   amount,
      //   currency,
      //   orderReference,
      //   siteReference,
      //   journey
      // });

      // Store user details in localStorage before redirecting (shared across tabs)
      if (userDetails && Object.keys(userDetails).length > 0) {
        try {
          localStorage.setItem('trustPaymentUserDetails', JSON.stringify(userDetails));
          // console.log('[Trust Payments] User details stored in localStorage');
        } catch (error) {
          // console.error('[Trust Payments] Error storing user details:', error);
        }
      }

      // Create a hidden form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `${domain}/process/payments/${journey}`;
      form.target = '_blank'; // Open in new tab

      // Helper function to add hidden input
      const addInput = (name, value) => {
        if (value !== undefined && value !== null && value !== '') {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = String(value);
          form.appendChild(input);
        }
      };

      // Required fields according to Trust Payments docs
      addInput('sitereference', siteReference);
      addInput('stprofile', profile);
      addInput('currencyiso3a', currency);
      addInput('mainamount', amount);
      addInput('version', '2');

      // Optional: Order reference for tracking
      if (orderReference) {
        addInput('orderreference', orderReference);
      }

      // Redirect URLs with rule identifiers
      if (successUrl) {
        addInput('ruleidentifier', 'STR-6'); // Enable success redirect rule
        addInput('successfulurlredirect', successUrl);
      }

      if (errorUrl) {
        addInput('ruleidentifier', 'STR-13'); // Enable error redirect rule
        addInput('errorurlredirect', errorUrl);
      }

      // Optional: User/billing details
      if (userDetails.billingFirstName) {
        addInput('billingfirstname', userDetails.billingFirstName);
      }
      if (userDetails.billingLastName) {
        addInput('billinglastname', userDetails.billingLastName);
      }
      if (userDetails.billingEmail) {
        addInput('billingemail', userDetails.billingEmail);
      }
      if (userDetails.billingCountry) {
        addInput('billingcountryiso2a', userDetails.billingCountry);
      }
      if (userDetails.billingPostcode) {
        addInput('billingpostcode', userDetails.billingPostcode);
      }
      if (userDetails.billingTown) {
        addInput('billingtown', userDetails.billingTown);
      }
      if (userDetails.billingStreet) {
        addInput('billingstreet', userDetails.billingStreet);
      }

      // Append form to body, submit, then remove
      document.body.appendChild(form);
      // console.log('[Trust Payments] Form created and submitting to:', form.action);

      form.submit();

      // Clean up after brief delay
      setTimeout(() => {
        document.body.removeChild(form);
      }, 100);

      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error('[Trust Payments] Payment submission error:', error);
      const errorMsg = `Payment error: ${error.message}`;
      setError(errorMsg);
    }
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Button
        onClick={handlePayment}
        disabled={disabled}
        variant="contained"
        fullWidth
        size="large"
        sx={{
          backgroundColor: '#EE1E50',
          color: 'white',
          py: 1.5,
          px: 3,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 4px 6px rgba(238, 30, 80, 0.25)',
          '&:hover': {
            backgroundColor: '#0D0D0D',
            boxShadow: '0 6px 10px rgba(13, 13, 13, 0.35)'
          },
          '&:disabled': {
            background: '#e0e0e0',
            color: '#9e9e9e'
          }
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <Payment sx={{ fontSize: 24 }} />
          <Typography variant="button" sx={{ fontSize: '1rem', fontWeight: 600 }}>
            Pay Now
          </Typography>
        </Box>
      </Button>
    </>
  );
};

export default TrustPaymentButton;
