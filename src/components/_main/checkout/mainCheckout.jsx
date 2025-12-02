'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next-nprogress-bar';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { sum } from 'lodash';
import { Box, Grid, CircularProgress, Backdrop } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import * as api from 'src/services';
import { resetCart, getCart } from 'src/redux/slices/product';
import CheckoutGuestFormSkeleton from '../skeletons/checkout/checkoutForm';
import PaymentInfoSkeleton from '../skeletons/checkout/paymentInfo';
import CardItemSekelton from '../skeletons/checkout/cartItems';
import TrustPaymentMethodCard from './TrustPaymentMethod';

const CheckoutForm = dynamic(() => import('src/components/forms/checkout'), {
  loading: () => <CheckoutGuestFormSkeleton />
});

const PaymentInfo = dynamic(() => import('src/components/_main/checkout/paymentInfo'), {
  loading: () => <PaymentInfoSkeleton />
});

const CartItemsCard = dynamic(() => import('src/components/cards/cartItems'), {
  loading: () => <CardItemSekelton />
});

const FullPageLoader = ({ message = 'Processing your payment...' }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        flexDirection: 'column',
        gap: 3
      }}
      open={true}
    >
      <CircularProgress size={80} thickness={4} sx={{ color: '#EE1E50' }} />
      <Box sx={{ color: '#fff', textAlign: 'center', maxWidth: '80%' }}>
        {message}
      </Box>
      <Box sx={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', maxWidth: '80%' }}>
        Please wait while we verify your payment. Do not close this page or refresh.
      </Box>
    </Backdrop>
  );
};

const TrustPaymentHandler = ({ onProcessTrustPayment, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusChecked, setStatusChecked] = useState(false);

  useEffect(() => {
    const handleTrustPaymentStatus = async () => {
      if (typeof window === 'undefined' || statusChecked) return;

      const urlParams = new URLSearchParams(window.location.search);
      const hasTrustParams = urlParams.has('settlestatus') || urlParams.has('errorcode');

      if (!hasTrustParams) {
        setStatusChecked(true);
        return;
      }

      setIsProcessing(true);

      try {
        const settleStatus = urlParams.get('settlestatus');
        const errorCode = urlParams.get('errorcode');
        const orderReference = urlParams.get('orderreference');
        const transactionReference = urlParams.get('transactionreference');
        const siteReference = urlParams.get('sitereference');
        const paymentType = urlParams.get('paymenttypedescription');

        await onProcessTrustPayment({
          settleStatus: parseInt(settleStatus),
          errorCode: errorCode ? parseInt(errorCode) : null,
          orderReference,
          transactionReference,
          siteReference,
          paymentType
        });
      } catch (error) {
        onError(error.message);
      } finally {
        setIsProcessing(false);
        setStatusChecked(true);
      }
    };

    handleTrustPaymentStatus();
  }, [onProcessTrustPayment, statusChecked, onError]);

  if (isProcessing) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={10}>
        <CircularProgress size={60} />
        <Box sx={{ mt: 2 }}>
          Verifying your payment...
        </Box>
        <Box sx={{ color: 'text.secondary', mt: 1 }}>
          Please wait while we confirm your payment status with Trust Payments.
        </Box>
      </Box>
    );
  }

  return null;
};

const CheckoutMain = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currency, rate, selectedCountry } = useSelector(({ settings }) => settings);
  const { checkout } = useSelector(({ product }) => product);
  const { user: userData } = useSelector(({ user }) => user);
  const { total, cart } = checkout;
  const checkoutType = cart[0]?.checkoutType;
  const [paymentMethod, setPaymentMethod] = useState('apple_pay');
  const [checked, setChecked] = React.useState(false);

  const [isTrustPaymentCallback, setIsTrustPaymentCallback] = useState(false);
  const [showCheckoutInterface, setShowCheckoutInterface] = useState(true);
  const [showProcessingOverlay, setShowProcessingOverlay] = useState(false);

  const handleChangeShipping = (event) => {
    setChecked(event.target.checked);
  };

  console.log("Checkout ITems", cart);

  const [couponCode, setCouponCode] = useState(null);
  const [isProcessing, setProcessingTo] = useState(false);
  const [totalWithDiscount, setTotalWithDiscount] = useState(null);

  const { mutate, isLoading } = useMutation('order', api.placeOrder, {
    onSuccess: (data) => {
      console.log("Order Response Data", data);
      localStorage.removeItem('trustPaymentUserDetails');
      dispatch(resetCart());
      toast.success(
        "Order placed successfully! You can view your order in the My Orders section."
      );
      router.push(`/profile/orders`);
    },
    onError: (err) => {
      const errorMsg = err.message || 'Something went wrong';
      localStorage.removeItem('trustPaymentUserDetails');
      toast.error(errorMsg);
      setProcessingTo(false);
      setShowProcessingOverlay(false);
      setShowCheckoutInterface(true);
    }
  });

  const [loading, setLoading] = React.useState(true);
  const { mutate: getCartMutate } = useMutation(api.getCart, {
    onSuccess: (res) => {
      dispatch(getCart(res.data));
      setLoading(false);
    },
    onError: (err) => {
      const message = err.response?.data?.message || 'Failed to sync cart';
      setLoading(false);
      toast.error(message || 'We ran into an issue. Please refresh the page or try again.');
    }
  });

  const handleTrustPaymentCallback = async (trustData) => {
    // ✅ Only process in the payment gateway tab, not the original tab
    if (window.opener) {
      // This is the payment gateway tab - proceed
      console.log('🔄 Processing payment in gateway tab');
    } else {
      // This is the original tab - check if we should process
      const shouldProcess = sessionStorage.getItem('trustPaymentProcessed') !== 'true';

      if (!shouldProcess) {
        console.log('🛑 Skipping payment processing in original tab');
        return;
      }
    }
    // Mark as processed to prevent duplicates
    sessionStorage.setItem('trustPaymentProcessed', 'true');

    if (handleTrustPaymentCallback.called) {
      return;
    }
    handleTrustPaymentCallback.called = true;

    setShowProcessingOverlay(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { settleStatus, errorCode, orderReference, transactionReference, siteReference, paymentType } = trustData;
    const isSuccess = settleStatus === 0 && errorCode === 0;

    if (isSuccess) {
      const storedUserDetails = localStorage.getItem('trustPaymentUserDetails');
      let userDataToUse = valuesRef.current;

      if (storedUserDetails) {
        try {
          userDataToUse = JSON.parse(storedUserDetails);
        } catch (error) {
          console.error('Error parsing stored user details:', error);
        }
      }

      const items = cart.map(({ ...others }) => others);


      const totalItems = sum(items.map((item) => item.quantity));

      const subTotal = items.reduce(
        (sum, item) => sum + (item.priceSale || item.price) * item.quantity,
        0
      );

      const shipping = userDataToUse.country && userDataToUse.country !== 'United Arab Emirates'
        ? parseInt(process.env.SHIPPING_FEE_OUTER || 0)
        : parseInt(process.env.SHIPPING_FEE || 0);

      const orderData = {
        paymentMethod: 'Trust Payments',
        items,
        user: {
          firstName: userDataToUse.billingFirstName || userDataToUse.firstName || '',
          lastName: userDataToUse.billingLastName || userDataToUse.lastName || '',
          email: userDataToUse.billingEmail || userDataToUse.email || '',
          address: userDataToUse.address || '',
          city: userDataToUse.city || '',
          state: userDataToUse.state || '',
          country: userDataToUse.country || '',
          zip: userDataToUse.zip || '',
          note: userDataToUse.note || ''
        },
        checkoutType,
        totalItems,
        couponCode: couponCode || null,
        currency: "GBP",
        conversionRate: rate,
        subTotal,
        shipping,
        total: checkoutType == "product" ? total : total + shipping,
        paymentId: transactionReference,
        description: `Order from Trust Payments - ${transactionReference}`
      };

      mutate(orderData);
    } else {
      localStorage.removeItem('trustPaymentUserDetails');

      let errorMessage = 'Payment was not successful.';

      switch (settleStatus) {
        case 2:
          errorMessage = 'Payment was declined. Please try a different payment method.';
          break;
        case 3:
          errorMessage = 'Payment was referred. Please contact your bank.';
          break;
        case 5:
          errorMessage = 'Payment failed. Please try again.';
          break;
        case 6:
          errorMessage = 'Payment was cancelled.';
          break;
        default:
          errorMessage = `Payment status: ${settleStatus}. Please try again or contact support.`;
      }

      toast.error(errorMessage);
      setProcessingTo(false);
      setShowProcessingOverlay(false);
      setShowCheckoutInterface(true);
    }
  };

  const handleTrustPaymentError = (errorMessage) => {
    setShowProcessingOverlay(false);
    setShowCheckoutInterface(true);
    toast.error('Failed to process payment status. Please try again.');
  };

  const [isFormValid, setIsFormValid] = useState(false);

  const NewAddressSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Enter a valid email').required('Email is required'),
    address: Yup.string().when('checkoutType', {
      is: (val) => val === 'physical-product',
      then: (schema) => schema.required('Delivery Address is required'),
      otherwise: (schema) => schema.notRequired().nullable()
    }),
    city: Yup.string().when('checkoutType', {
      is: (val) => val === 'physical-product',
      then: (schema) => schema.required('City is required'),
      otherwise: (schema) => schema.notRequired().nullable()
    }),
    state: Yup.string().when('checkoutType', {
      is: (val) => val === 'physical-product',
      then: (schema) => schema.required('State is required'),
      otherwise: (schema) => schema.notRequired().nullable()
    }),
    zip: Yup.string().when('checkoutType', {
      is: (val) => val === 'physical-product',
      then: (schema) => schema.required('Zip is required'),
      otherwise: (schema) => schema.notRequired().nullable()
    }),
    country: Yup.string().when('checkoutType', {
      is: (val) => val === 'physical-product',
      then: (schema) => schema.required('Country is required'),
      otherwise: (schema) => schema.notRequired().nullable()
    }),
    checkoutType: Yup.string().optional('')
  });

  const formik = useFormik({
    initialValues: {
      firstName: userData?.firstName || '',
      lastName: userData?.LastName || '',
      email: userData?.email || '',
      address: '',
      city: '',
      state: '',
      country: '',
      note: '',
      zip: '',
      checkoutType: cart[0]?.checkoutType
    },
    enableReinitialize: true,
    validationSchema: NewAddressSchema,
    onSubmit: async (values) => {
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
      }
    }
  });

  const { errors, values, touched, handleSubmit, getFieldProps } = formik;

  useEffect(() => {
    const checkValidity = () => {
      const isValid =
        values.firstName !== '' &&
        values.lastName !== '' &&
        values.email !== '' &&
        !errors.firstName &&
        !errors.lastName &&
        !errors.email &&
        !errors.address &&
        !errors.city &&
        !errors.state &&
        !errors.country &&
        !errors.zip;

      setIsFormValid(isValid);
    };

    checkValidity();
  }, [values, errors]);

  const valuesRef = useRef(formik.values);

  useEffect(() => {
    valuesRef.current = formik.values;
  }, [formik.values]);

  React.useEffect(() => {
    formik.validateForm();

    if (!cart || cart.length < 1) {
      router.push('/');
    } else {
      setLoading(true);
      getCartMutate(cart);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const hasTrustParams = urlParams.has('settlestatus') || urlParams.has('errorcode');
      setIsTrustPaymentCallback(hasTrustParams);
      setShowCheckoutInterface(!hasTrustParams);
    }
  }, []);

  const shippingFee = checkoutType === 'physical-product' ?
    (values?.country && values?.country != 'United Arab Emirates'
      ? parseInt(process.env.SHIPPING_FEE_OUTER || 0)
      : parseInt(process.env.SHIPPING_FEE || 0)
    )
    : 0;

  const calculatedAmount = totalWithDiscount || (total + shippingFee);


  if (isTrustPaymentCallback && !showCheckoutInterface) {
    return (
      <>
        <Suspense
          fallback={
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
              <CircularProgress />
              <Box sx={{ ml: 2 }}>
                Loading...
              </Box>
            </Box>
          }
        >
          <TrustPaymentHandler
            onProcessTrustPayment={handleTrustPaymentCallback}
            onError={handleTrustPaymentError}
          />
        </Suspense>
        {showProcessingOverlay && <FullPageLoader />}
      </>
    );
  }

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
                checkoutType={checkoutType}
              />
            </Grid>
            <Grid item xs={12} md={4} flexGrow={1}>
              <PaymentInfo
                loading={loading}
                setCouponCode={setCouponCode}
                setTotal={(v) => setTotalWithDiscount(v)}
                checkoutType={checkoutType}
                values={values}
              />
              <TrustPaymentMethodCard
                value={paymentMethod}
                setValue={setPaymentMethod}
                showApplePay={true}
                useMockMode={false}
                amount={calculatedAmount}
                currency='GBP'
                orderReference={Date.now()}
                isFormValid={isFormValid}
                loading={isLoading || isProcessing || loading}
                disabled={!isFormValid}
                userDetails={{
                  billingFirstName: values.firstName,
                  billingLastName: values.lastName,
                  billingEmail: values.email,
                  billingCountry: selectedCountry || 'GB',
                  address: values.address,
                  city: values.city,
                  state: values.state,
                  country: values.country,
                  zip: values.zip,
                  note: values.note || ''
                }}
                checkoutType={checkoutType}
              />
              <br />
            </Grid>
          </Grid>
        </Box>
      </Form>

      {showProcessingOverlay && <FullPageLoader />}
    </FormikProvider>
  );
};

export default CheckoutMain;