import React from 'react';
// mui
import { Box, Grid, Skeleton } from '@mui/material';
// components
import PaymentSummarySkeleton from './paymentSummary';
import ShoppingCartSkeleton from './shoppingcart';

export default function MainCartSkeleton() {
  return (
    <Box py={5}>
      <Grid container spacing={2}>
        <Grid item sx={{
              width: {
                xs: '100%', // mobile
                md: '60%'   // desktop
              }
            }}>
          <ShoppingCartSkeleton />
        </Grid>
        <Grid item sx={{
              width: {
                xs: '100%', // mobile
                md: '30%'   // desktop
              }
            }}>
          <PaymentSummarySkeleton />
          <Box mt={2}>
            <Skeleton variant="rounded" width="100%" height={48} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
