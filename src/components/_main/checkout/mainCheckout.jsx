'use client';
import React, { useState } from 'react';
// next
import dynamic from 'next/dynamic';
import { useRouter } from 'next-nprogress-bar';
// mui
import { Box, Collapse, Grid } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'react-query';
// yup
import * as Yup from 'yup';
// formik
import { useFormik, Form, FormikProvider } from 'formik';
// api
import * as api from 'src/services';

// stripe
import { useStripe, useElements } from '@stripe/react-stripe-js';
// toast
import { toast } from 'react-hot-toast';
// Componensts
import { resetCart, getCart } from 'src/lib/redux/slices/product';
import PayPalPaymentMethod from '../../paypal/paypal';

import countries from './countries.json';
// lodash
import { sum } from 'lodash';
// paypal
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import CheckoutGuestFormSkeleton from '../skeletons/checkout/checkoutForm';
import PaymentInfoSkeleton from '../skeletons/checkout/paymentInfo';
import PaymentMethodCardSkeleton from '../skeletons/checkout/paymentMethod';
import CardItemSekelton from '../skeletons/checkout/cartItems';
// dynamic components
const CheckoutForm = dynamic(() => import('src/components/forms/checkout'), {
  loading: () => <CheckoutGuestFormSkeleton />
});
const PaymentInfo = dynamic(() => import('src/components/_main/checkout/paymentInfo'), {
  loading: () => <PaymentInfoSkeleton />
});
const PaymentMethodCard = dynamic(() => import('src/components/_main/checkout/paymentMethod'), {
  loading: () => <PaymentMethodCardSkeleton />
});

const CartItemsCard = dynamic(() => import('src/components/cards/cartItems'), {
  loading: () => <CardItemSekelton />
});

const initialOptions = {
  'client-id': process.env.PAYPAL_CLIENT_ID,
  'disable-funding': 'paylater',
  vault: 'true',
  intent: 'capture'
};

const CheckoutMain = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { checkout } = useSelector(({ product }) => product);
  const { user: userData } = useSelector(({ user }) => user);
  const { cart, total } = checkout;
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [isProcessing, setProcessingTo] = useState(false);

  const [totalWithDiscount, setTotalWithDiscount] = useState(null);
  const elements = useElements();
  const stripe = useStripe();
  const { mutate, isLoading } = useMutation('order', api.placeOrder, {
    onSuccess: (data) => {
      console.log(data, 'data');
      debugger;
      toast.success('Order placed!');
      setProcessingTo(false);

      router.push(`/order/${data.orderId}`);
      dispatch(resetCart());
    },
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong');
      setProcessingTo(false);
    }
  });

  const [loading, setLoading] = React.useState(true);
  const { mutate: getCartMutate } = useMutation(api.getCart, {
    onSuccess: (res) => {
      dispatch(getCart(res.data));
      setLoading(false);
    },
    onError: (err) => {
      const message = JSON.stringify(err.response.data.message);
      setLoading(false);
      toast.error(message ? JSON.parse(message) : 'Something went wrong!');
    }
  });
  React.useEffect(() => {
    formik.validateForm();
    if (cart.length < 1) {
      router.push('/');
    } else {
      setLoading(true);
      getCartMutate(cart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const NewAddressSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phone: Yup.string().required('Phone is required'),
    email: Yup.string().email('Enter email Valid').required('Email is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    zip: Yup.string().required('Postal is required')
  });
  const formik = useFormik({
    initialValues: {
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      phone: userData?.phone || '',
      email: userData?.email || '',
      address: userData?.address || '',
      city: userData?.city || '',
      state: userData?.state || '',
      country: userData?.country || 'Pakistan',
      zip: userData?.zip || ''
    },
    enableReinitialize: true,
    validationSchema: NewAddressSchema,
    onSubmit: async (values) => {
      const items = cart.map(({ ...others }) => others);
      const totalItems = sum(items.map((item) => item.quantity));

      const data = {
        paymentMethod: paymentMethod,
        items: items,
        user: values,
        totalItems,
        couponCode,
        shipping: process.env.SHIPPING_FEE || 0
      };
      if (data.paymentMethod === 'stripe') {
        onSubmit(data);
      } else {
        mutate(data);
      }
    }
  });
  const { errors, values, touched, handleSubmit, getFieldProps, isValid } = formik;

  const onSubmit = async ({ ...data }) => {
    setProcessingTo(true);
    setCheckoutError(null);
    const selected = countries.find((v) => v.label.toLowerCase() === values.country.toLowerCase());
    const billingDetails = {
      name: values.firstName + ' ' + values.lastName,
      email: values.email,
      address: {
        city: values.city,
        line1: values.address,
        state: values.state,
        postal_code: values.zip,
        country: selected?.code.toLocaleLowerCase() || 'us'
      }
    };

    const cardElement = elements.getElement('card');
    try {
      const { client_secret: clientSecret } = await api.paymentIntents(Number(totalWithDiscount || checkout.total));

      const paymentMethodReq = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails
      });

      if (paymentMethodReq?.error) {
        setCheckoutError(paymentMethodReq.error.message);
        setProcessingTo(false);
        return;
      }

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodReq?.paymentMethod.id
      });

      if (error) {
        setCheckoutError(error.message);
        setProcessingTo(false);
        return;
      }

      setProcessingTo(false);

      mutate({
        ...data,
        paymentMethod: 'Stripe',
        couponCode,
        paymentId: paymentMethodReq?.paymentMethod.id
      });
      return;
    } catch (err) {
      setCheckoutError(err?.response?.data?.message);
      setProcessingTo(false);
    }
  };

  const onSuccessPaypal = async (paymentId) => {
    const items = cart.map(({ ...others }) => others);

    const totalItems = sum(items.map((item) => item.quantity));
    const data = {
      paymentMethod: 'PayPal',
      items: items,
      user: values,
      totalItems,
      couponCode,
      shipping: process.env.SHIPPING_FEE || 0
    };

    mutate({
      ...data,
      paymentId: paymentId
    });
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box py={5}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <CheckoutForm getFieldProps={getFieldProps} touched={touched} errors={errors} />
            </Grid>
            <Grid item xs={12} md={4}>
              <CartItemsCard cart={cart} loading={loading} />
              <PaymentInfo loading={loading} setCouponCode={setCouponCode} setTotal={(v) => setTotalWithDiscount(v)} />
              <PaymentMethodCard
                loading={loading}
                value={paymentMethod}
                setValue={setPaymentMethod}
                error={checkoutError}
              />
              <br />

              <Collapse in={paymentMethod === 'paypal'}>
                <PayPalScriptProvider options={initialOptions}>
                  <PayPalPaymentMethod
                    onSuccess={onSuccessPaypal}
                    values={values}
                    total={totalWithDiscount || total}
                    isValid={isValid}
                    formik={formik}
                    couponCode={couponCode}
                  />
                </PayPalScriptProvider>
              </Collapse>

              <Collapse in={paymentMethod !== 'paypal'}>
                <LoadingButton
                  variant="contained"
                  fullWidth
                  size="large"
                  type="submit"
                  loading={isLoading || isProcessing || loading}
                >
                  Place Order
                </LoadingButton>
              </Collapse>
            </Grid>
          </Grid>
        </Box>
      </Form>
    </FormikProvider>
  );
};

export default CheckoutMain;
