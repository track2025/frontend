'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next-nprogress-bar';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { sum } from 'lodash';
// mui
import { Box, Collapse, Grid, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
// yup
import * as Yup from 'yup';
// formik
import { useFormik, Form, FormikProvider } from 'formik';
// api
import * as api from 'src/services';
// stripe
import { useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';

// Components
import { resetCart, getCart } from 'src/redux/slices/product';
import CheckoutGuestFormSkeleton from '../skeletons/checkout/checkoutForm';
import PaymentInfoSkeleton from '../skeletons/checkout/paymentInfo';
import PaymentMethodCardSkeleton from '../skeletons/checkout/paymentMethod';
import CardItemSekelton from '../skeletons/checkout/cartItems';
// hooks
import { useCurrencyConvert } from 'src/hooks/convertCurrency';
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

const CheckoutMain = () => {
  const router = useRouter();
  const cCurrency = useCurrencyConvert();
  const dispatch = useDispatch();
  const { currency, rate } = useSelector(({ settings }) => settings);
  const { checkout } = useSelector(({ product }) => product);
  const { user: userData } = useSelector(({ user }) => user);
  const { cart, total } = checkout;
  const [paymentMethod, setPaymentMethod] = useState('apple_pay');
  const [checked, setChecked] = React.useState(false);
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [showApplePay, setShowApplePay] = useState(false);

  // Ref to track if we've already attempted to initialize Apple Pay
  const applePayInitialized = useRef(false);

  const handleChangeShipping = (event) => {
    setChecked(event.target.checked);
  };

  const [couponCode, setCouponCode] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [isProcessing, setProcessingTo] = useState(false);
  const [totalWithDiscount, setTotalWithDiscount] = useState(null);
  const elements = useElements();
  const stripe = useStripe();

  const { mutate, isLoading } = useMutation('order', api.placeOrder, {
    onSuccess: (data) => {
      toast.success(
        "🎉 Your order was successful! We've emailed you the download link. You can also find it anytime in the 'My Orders' section of your account."
      );
      setProcessingTo(false);
      router.push(`/order/${data.orderId}`);
      dispatch(resetCart());
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Something went wrong');
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
      const message = JSON.stringify(err.response?.data?.message);
      setLoading(false);
      toast.error(message ? JSON.parse(message) : 'We ran into an issue. Please refresh the page or try again.');
    }
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const NewAddressSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Enter a valid email').required('Email is required')
  });

  // Define initial values
  const formik = useFormik({
    initialValues: {
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      email: userData?.email || ''
    },
    enableReinitialize: true,
    validationSchema: NewAddressSchema,
    onSubmit: async (values) => {
      // For credit card payments only
      if (paymentMethod === 'credit_card') {
        const items = cart.map(({ ...others }) => others);
        const totalItems = sum(items.map((item) => item.quantity));

        const data = {
          paymentMethod: 'Stripe',
          items: items,
          user: values,
          totalItems,
          couponCode,
          currency: 'GBP',
          conversionRate: rate,
          shipping: process.env.SHIPPING_FEE || 0
        };

        onSubmit(data);
      }
    }
  });

  const { errors, values, touched, handleSubmit, getFieldProps, setTouched } = formik;

  // Check form validity - FIXED VERSION
  useEffect(() => {
    const checkValidity = () => {
      const isValid =
        values.firstName !== '' &&
        values.lastName !== '' &&
        values.email !== '' &&
        !errors.firstName &&
        !errors.lastName &&
        !errors.email;

      setIsFormValid(isValid);
    };

    checkValidity();
  }, [values, errors]);

  // Prepare order data for both payment methods
  const prepareOrderData = useCallback(
    (paymentId, paymentMethodType = 'Stripe') => {
      const items = cart.map(({ ...others }) => others);
      const totalItems = sum(items.map((item) => item.quantity));

      return {
        paymentMethod: paymentMethodType,
        items: items,
        user: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email
        },
        totalItems,
        couponCode,
        currency: 'GBP',
        conversionRate: rate,
        shipping: process.env.SHIPPING_FEE || 0,
        paymentId: paymentId
      };
    },
    [cart, couponCode, rate, values]
  );

  // Separate Apple Pay handler function
  const handleApplePayPayment = useCallback(
    async (ev) => {
      setProcessingTo(true);
      try {
        // 1. Get data from Apple Pay and merge with form data
        const applePayData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email
        };

        // 2. Validate required data
        if (!applePayData.email || !applePayData.firstName || !applePayData.lastName) {
          throw new Error('Missing required information from Apple Pay');
        }

        // 3. Create payment intent with GBP currency
        const { client_secret: clientSecret } = await api.paymentIntents(totalWithDiscount || total, 'gbp');

        // 4. Confirm payment with proper error handling
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: ev.paymentMethod.id
          },
          { handleActions: false }
        );

        // 5. Handle payment actions if required
        if (paymentIntent && paymentIntent.status === 'requires_action') {
          const { error: actionError } = await stripe.handleCardAction(clientSecret);
          if (actionError) {
            throw new Error(actionError.message);
          }
        }

        if (confirmError) {
          throw new Error(confirmError.message);
        }

        ev.complete('success');

        // 6. Prepare and send order data
        const orderData = prepareOrderData(ev.paymentMethod.id, 'Stripe (Apple Pay)');

        // Merge Apple Pay data with form data
        orderData.user = {
          ...orderData.user,
          ...applePayData
        };

        mutate(orderData);
      } catch (err) {
        ev.complete('fail');
        setCheckoutError(err.message);
        setProcessingTo(false);
      }
    },
    [stripe, total, totalWithDiscount, prepareOrderData, mutate, values]
  );

  // Initialize Apple Pay
  useEffect(() => {
    const initializeApplePay = async () => {
      if (!stripe || !total || applePayInitialized.current) return;

      applePayInitialized.current = true;

      const pr = stripe.paymentRequest({
        country: 'GB',
        currency: 'gbp',
        total: {
          label: 'Total',
          amount: Math.round((totalWithDiscount || total) * 100)
        },
        requestPayerName: true,
        requestPayerEmail: true
      });

      try {
        const canMakePayment = await pr.canMakePayment();

        if (canMakePayment?.applePay) {
          setPaymentRequest(pr);
          setShowApplePay(true);

          // Add event listener
          pr.on('paymentmethod', handleApplePayPayment);
        } else {
          setShowApplePay(false);
          setPaymentMethod('credit_card');
        }
      } catch (error) {
        console.error('Apple Pay initialization failed:', error);
        setShowApplePay(false);
        setPaymentMethod('credit_card');
      }
    };

    initializeApplePay();

    return () => {
      if (paymentRequest) {
        paymentRequest.off('paymentmethod', handleApplePayPayment);
      }
    };
  }, [stripe, total, totalWithDiscount, handleApplePayPayment]);

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

  // Modify the onSubmit function to handle credit card payments
  const onSubmit = async (data) => {
    setProcessingTo(true);
    setCheckoutError(null);

    const billingDetails = {
      name: `${values.firstName} ${values.lastName}`,
      email: values.email
    };

    const cardElement = elements.getElement('card');
    try {
      const { client_secret: clientSecret } = await api.paymentIntents(totalWithDiscount || total, 'gbp');

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

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodReq?.paymentMethod.id
      });

      if (paymentIntent && paymentIntent.status === 'requires_action') {
        const { error: actionError } = await stripe.handleCardAction(clientSecret);
        if (actionError) {
          setCheckoutError(actionError.message);
          setProcessingTo(false);
          return;
        }
      }

      if (error) {
        setCheckoutError(error.message);
        setProcessingTo(false);
        return;
      }

      setProcessingTo(false);

      const orderData = prepareOrderData(paymentMethodReq?.paymentMethod.id);
      mutate(orderData);
      return;
    } catch (err) {
      setCheckoutError(err?.response?.data?.message || 'Payment failed');
      setProcessingTo(false);
    }
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setCheckoutError(null);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box py={5}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8} flexGrow={1}>
              <CartItemsCard cart={cart} loading={loading} />

              <CheckoutForm
                getFieldProps={getFieldProps}
                touched={touched}
                errors={errors}
                values={values}
                handleChangeShipping={handleChangeShipping}
                checked={checked}
              />
            </Grid>
            <Grid item xs={12} md={4} flexGrow={1}>
              <PaymentInfo loading={loading} setCouponCode={setCouponCode} setTotal={(v) => setTotalWithDiscount(v)} />
              <PaymentMethodCard
                loading={loading}
                value={paymentMethod}
                setValue={handlePaymentMethodChange}
                error={checkoutError}
                showApplePay={showApplePay}
                isFormValid={isFormValid}
              />
              <br />

              {/* Apple Pay Button */}
              {paymentMethod === 'apple_pay' && showApplePay && paymentRequest && (
                <Box sx={{ mb: 2 }}>
                  <PaymentRequestButtonElement
                    options={{ paymentRequest }}
                    onClick={async () => {
                      // Validate form fields directly
                      const fieldErrors = await formik.validateForm();
                      const hasErrors = Object.keys(fieldErrors).length > 0;

                      if (hasErrors) {
                        // Mark fields as touched to show errors
                        setTouched({
                          firstName: true,
                          lastName: true,
                          email: true
                        });

                        toast.error('Please fill all required fields correctly');
                        return false;
                      }

                      return true;
                    }}
                  />
                </Box>
              )}

              {paymentMethod === 'apple_pay' && showApplePay && !isFormValid && (
                <Box sx={{ mb: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="warning.contrastText" textAlign="center">
                    Please complete all required fields above to use Apple Pay
                  </Typography>
                </Box>
              )}

              {/* Place Order button for credit card payments */}
              <Collapse in={paymentMethod === 'credit_card'}>
                <LoadingButton
                  variant="contained"
                  fullWidth
                  size="large"
                  type="submit"
                  loading={isLoading || isProcessing || loading}
                  disabled={!isFormValid}
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
