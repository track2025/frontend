'use client';
import React from 'react';
// proptypes
import PropTypes from 'prop-types';
// mui
import { Card, Button, CardHeader, Typography, Box, Skeleton, Stack, Divider } from '@mui/material';
// next
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
// lodash
import { sum } from 'lodash';
// formik
import { useFormik, Form, FormikProvider } from 'formik';
// icons
import { IoArrowBackOutline } from 'react-icons/io5';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { deleteCart, increaseQuantity, decreaseQuantity, getCart } from 'src/lib/redux/slices/product';
// component
import CheckoutCard from 'src/components/cards/checkout';
import CheckoutProductList from 'src/components/lists/checkoutProduct';
// Styled
import RootStyled from './styled';

ShoppingCart.propTypes = {
  loading: PropTypes.bool.isRequired
};

const EmptyCart = dynamic(() => import('src/components/illustrations/emptyCart'), {
  loading: () => (
    <Stack>
      <Skeleton variant="rectangular" width="100%" height={300} />
    </Stack>
  )
});
// ----------------------------------------------------------------------

export default function ShoppingCart({ loading }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { checkout } = useSelector(({ product }) => product);
  const { cart } = checkout;

  const [count, setCount] = React.useState(0);

  const isEmptyCart = cart.length === 0;
  const handleDeleteCart = (productId) => {
    dispatch(deleteCart(productId));
    setCount((prev) => prev + 1);
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
    setCount((prev) => prev + 1);
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
    setCount((prev) => prev + 1);
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { products: [] },
    onSubmit: () => {}
  });
  const { handleSubmit } = formik;
  const totalItems = sum(cart?.map((item) => item.quantity));

  React.useEffect(() => {
    dispatch(getCart(cart));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <RootStyled>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card className="card-main">
            <CardHeader
              className="card-header"
              title={
                loading ? (
                  <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} width={120} />
                ) : (
                  <Typography variant="h4">
                    Shopping Cart
                    <Typography component="span" color="text.secondary">
                      &nbsp;({totalItems} {totalItems > 1 ? 'items' : 'item'})
                    </Typography>
                  </Typography>
                )
              }
            />

            {!isEmptyCart ? (
              <>
                <CheckoutCard
                  formik={formik}
                  onDelete={handleDeleteCart}
                  onIncreaseQuantity={handleIncreaseQuantity}
                  onDecreaseQuantity={handleDecreaseQuantity}
                  cart={cart}
                />
                <Box className="product-list">
                  <CheckoutProductList
                    formik={formik}
                    onDelete={handleDeleteCart}
                    onIncreaseQuantity={handleIncreaseQuantity}
                    onDecreaseQuantity={handleDecreaseQuantity}
                    isLoading={loading}
                    cart={cart}
                  />
                </Box>
              </>
            ) : (
              <EmptyCart />
            )}
            <Divider />
            <Box mt={2}>
              <Button color="inherit" onClick={() => router.push('/')} startIcon={<IoArrowBackOutline />}>
                Continue Shopping
              </Button>
            </Box>
          </Card>
        </Form>
      </FormikProvider>
    </RootStyled>
  );
}
