'use client';
import React from 'react';
import PropTypes from 'prop-types';

// mui
import {
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  Typography,
  Stack,
  RadioGroup,
  Collapse,
  Box,
  Divider
} from '@mui/material';
// icons
import { BsStripe } from 'react-icons/bs';
import { SiApplepay } from 'react-icons/si';
// components
import StripeCheckoutForm from 'src/components/stripe/Form';

PaymentMethodCard.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  error: PropTypes.string,
  showApplePay: PropTypes.bool,
  loading: PropTypes.bool,
  isFormValid: PropTypes.bool
};

export default function PaymentMethodCard({ value, setValue, error, showApplePay, loading, isFormValid }) {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" mb={1}>
          Payment Method
        </Typography>
        <Stack spacing={1} mt={1}>
          <RadioGroup value={value} onChange={handleChange} sx={{ pl: 1 }}>
            {/* Apple Pay Option */}
            {showApplePay && (
              <FormControlLabel
                value="apple_pay"
                control={<Radio />}
                disabled={loading}
                label={
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    ml={1}
                    sx={{
                      svg: {
                        color: value === 'apple_pay' ? 'primary.main' : 'text.primary'
                      }
                    }}
                  >
                    <SiApplepay size={24} />
                    <Typography variant="subtitle2">Apple Pay</Typography>
                  </Stack>
                }
              />
            )}

            {/* Credit Card Option */}
            <FormControlLabel
              value="credit_card"
              control={<Radio />}
              disabled={loading}
              label={
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  ml={1}
                  sx={{
                    svg: {
                      color: value === 'credit_card' ? 'primary.main' : 'text.primary'
                    }
                  }}
                >
                  <BsStripe size={20} />
                  <Typography variant="subtitle2">Credit Card</Typography>
                </Stack>
              }
            />
          </RadioGroup>
        </Stack>

        {/* Show message when Apple Pay is selected */}
        <Collapse in={value === 'apple_pay' && showApplePay}>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Use Apple Pay for fast, secure checkout. All payments are processed in GBP (£).
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Box>
        </Collapse>

        {/* Show credit card form when credit card is selected */}
        <Collapse in={value === 'credit_card'}>
          <Typography variant="subtitle1" color="text.secondary" mt={1} mb={1}>
            Credit Card
          </Typography>
          <StripeCheckoutForm error={error} />
        </Collapse>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
