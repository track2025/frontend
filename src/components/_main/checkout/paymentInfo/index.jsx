// PaymentInfo.jsx
'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// mui
import { Card, CardContent, Typography, Stack, Divider, TextField, Skeleton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hook
import { useCurrencyConvert } from 'src/hooks/convertCurrency';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';

// api
import * as api from 'src/services';
import { useMutation } from 'react-query';
// redux
import { applyCoupon, removeCoupon } from 'src/redux/slices/product';

PaymentInfo.propTypes = {
  checkoutType: PropTypes.string,
  values: PropTypes.object
};

function isExpired(expirationDate) {
  const currentDateTime = new Date();
  return currentDateTime >= new Date(expirationDate);
}

export default function PaymentInfo({ checkoutType, values }) {
  const dispatch = useDispatch();
  const { product } = useSelector((state) => state);
  const { total, shipping, subtotal, discount, appliedDiscount, couponCode } = product.checkout;

  const [code, setCode] = useState('');
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormatter();

  const { mutate, isLoading } = useMutation(api.applyCouponCode, {
    onSuccess: ({ data }) => {
      const expired = isExpired(data.expire);
      if (expired) {
        toast.error('Coupon code is expired!');
        return;
      }

      let discountAmount = 0;

      if (data.type === 'percent') {
        discountAmount = (data.discount / 100) * subtotal;
      } else {
        discountAmount = data.discount;
      }

      // Dispatch to Redux store
      dispatch(applyCoupon({
        discount: discountAmount,
        couponCode: code,
        discountType: data.type
      }));

      toast.success('Coupon code applied. You have saved ' + fCurrency(cCurrency(discountAmount)));
    },
    onError: () => {
      toast.error('Coupon code is not valid');
    }
  });

  const onApplyCoupon = () => {
    if (code.length > 3) {
      mutate(code);
    } else {
      toast.error('Enter valid coupon code.');
    }
  };

  const onRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCode('');
    toast.success('Coupon removed');
  };

  // Calculate shipping based on location for physical products
  const calculateShipping = () => {
    if (checkoutType !== 'physical-product') return 0;

    if (values?.country && values?.country !== 'United Arab Emirates') {
      return parseInt(process.env.SHIPPING_FEE_OUTER || 0);
    }
    return parseInt(process.env.SHIPPING_FEE || 0);
  };

  const currentShipping = checkoutType === 'physical-product' ? calculateShipping() : shipping;
  const displayTotal = total + currentShipping; // Adjust for actual shipping

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ py: 2 }}>
        <Typography variant="h4" mb={1}>
          Payment Summary
        </Typography>

        <Stack spacing={0} mt={1} mb={2} gap={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Subtotal:
            </Typography>
            <Typography variant="subtitle2">{fCurrency(cCurrency(subtotal))}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Discount:
            </Typography>
            <Typography variant="subtitle2">-{fCurrency(cCurrency(appliedDiscount || 0))}</Typography>
          </Stack>

          <Stack direction={'row'} gap={1}>
            <TextField
              id="coupon-field"
              fullWidth
              placeholder="Enter coupon code"
              size="small"
              value={code}
              disabled={Boolean(couponCode)}
              onChange={(e) => setCode(e.target.value)}
            />
            {couponCode ? (
              <LoadingButton
                onClick={onRemoveCoupon}
                variant="outlined"
                color="error"
              >
                Remove
              </LoadingButton>
            ) : (
              <LoadingButton
                loading={isLoading}
                onClick={onApplyCoupon}
                variant="contained"
                color="primary"
                disabled={code.length < 4}
              >
                Apply
              </LoadingButton>
            )}
          </Stack>
        </Stack>

        {checkoutType === 'physical-product' && (
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Shipping:
            </Typography>
            <Typography variant="subtitle2">
              {isLoading ? (
                <Skeleton variant="text" width={80} />
              ) : (
                fCurrency(cCurrency(currentShipping))
              )}
            </Typography>
          </Stack>
        )}

        <Divider />
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mt={2}>
          <Typography variant="subtitle1">Total:</Typography>
          <Typography variant="subtitle1">
            {fCurrency(cCurrency(displayTotal))}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}