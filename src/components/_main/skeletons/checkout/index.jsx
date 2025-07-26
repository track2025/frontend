import { Box, Grid, Skeleton } from '@mui/material';
import React from 'react';
// components
import CheckoutGuestFormSkeleton from './checkoutForm';
import PaymentInfoSkeleton from './paymentInfo';
import CardItemSekelton from './cartItems';
import PaymentMethodCardSkeleton from './paymentMethod';

export default function CheckoutSkeleton() {
  return (
    <Box py={5}>
      <Grid container spacing={2}>
        <Grid item sx={{
              width: {
                xs: '100%', // mobile
                md: '60%'   // desktop
              }
            }}>
          <CheckoutGuestFormSkeleton />
        </Grid>
        <Grid item sx={{
              width: {
                xs: '100%', // mobile
                md: '30%'   // desktop
              }
            }}>
          <CardItemSekelton />
          <PaymentInfoSkeleton />
          <PaymentMethodCardSkeleton />
          <br />
          <Skeleton variant="rounded" height={48} />
        </Grid>
      </Grid>
    </Box>
  );
}
