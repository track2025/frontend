'use client';
import React from 'react';

// next
import dynamic from 'next/dynamic';
import { useRouter } from 'next-nprogress-bar';
// mui
import { Box, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// api
import * as api from 'src/services';
// react query
import { useMutation } from 'react-query';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from 'src/lib/redux/slices/product';
import PaymentSummarySkeleton from 'src/components/skeletons/cart/paymentSummary';
import ShoppingCartSkeleton from 'src/components/skeletons/cart/shoppingcart';
// components
const ShoppingCart = dynamic(() => import('src/components/_main/cart/shoppingCart'), {
  loading: () => <ShoppingCartSkeleton />
});
const PaymentSummary = dynamic(() => import('src/components/_main/cart/paymentSummary'), {
  loading: () => <PaymentSummarySkeleton />
});

export default function CartMain() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { checkout } = useSelector(({ product }) => product);
  const { cart } = checkout;
  const [loading, setLoading] = React.useState(true);
  const { mutate } = useMutation(api.getCart, {
    onSuccess: (res) => {
      setLoading(false);
      dispatch(getCart(res.data));
    },
    onError: (err) => {
      const message = JSON.stringify(err.response.data.message);
      setLoading(false);
      toast.error(message ? JSON.parse(message) : 'Something went wrong!');
    }
  });
  React.useEffect(() => {
    setLoading(true);
    mutate(cart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isEmptyCart = cart.length === 0;
  return (
    <Box>
      <Box py={5}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <ShoppingCart loading={loading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PaymentSummary loading={loading} />
            <Box mt={2}>
              <LoadingButton
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  borderRadius: '8px'
                }}
                disabled={isEmptyCart}
                loading={loading}
                onClick={() => router.push('/checkout')}
              >
                Checkout
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
