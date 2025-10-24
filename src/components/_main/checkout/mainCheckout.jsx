'use client';
import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next-nprogress-bar';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { sum } from 'lodash';
// mui
import { Box, Grid, Typography, Modal, Paper, IconButton, Alert, CircularProgress } from '@mui/material';
import { Close, BugReport } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
// yup
import * as Yup from 'yup';
// formik
import { useFormik, Form, FormikProvider } from 'formik';
// api
import * as api from 'src/services';

// Components
import { resetCart, getCart } from 'src/redux/slices/product';
import CheckoutGuestFormSkeleton from '../skeletons/checkout/checkoutForm';
import PaymentInfoSkeleton from '../skeletons/checkout/paymentInfo';
import CardItemSekelton from '../skeletons/checkout/cartItems';
// hooks
import { useCurrencyConvert } from 'src/hooks/convertCurrency';
import TrustPaymentMethodCard from './TrustPaymentMethod';

// dynamic components
const CheckoutForm = dynamic(() => import('src/components/forms/checkout'), {
  loading: () => <CheckoutGuestFormSkeleton />
});
const PaymentInfo = dynamic(() => import('src/components/_main/checkout/paymentInfo'), {
  loading: () => <PaymentInfoSkeleton />
});
const CartItemsCard = dynamic(() => import('src/components/cards/cartItems'), {
  loading: () => <CardItemSekelton />
});

// Debug Console Component
const DebugConsole = ({ logs, onClear, open, onClose }) => {
  const modalStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '80%',
    maxWidth: '500px',
    maxHeight: '60vh',
    overflow: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    zIndex: 9999
  };

  return (
    <>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          zIndex: 10000,
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark'
          }
        }}
      >
        <BugReport />
      </IconButton>

      <Modal open={open} onClose={onClose}>
        <Paper sx={modalStyle}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Debug Console</Typography>
            <Box>
              <IconButton onClick={onClear} size="small" sx={{ mr: 1 }}>
                <Typography variant="body2">Clear</Typography>
              </IconButton>
              <IconButton onClick={onClose} size="small">
                <Close />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ height: '40vh', overflow: 'auto' }}>
            {logs.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No logs yet. Payment interactions will appear here.
              </Typography>
            ) : (
              logs.map((log, index) => (
                <Box
                  key={index}
                  sx={{ mb: 1, p: 1, bgcolor: log.type === 'error' ? 'error.light' : 'grey.100', borderRadius: 1 }}
                >
                  <Typography
                    variant="caption"
                    display="block"
                    color={log.type === 'error' ? 'error.contrastText' : 'text.secondary'}
                  >
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                    {log.message}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

// Response Alert Modal
const ResponseAlertModal = ({ open, onClose, title, message, type = 'info' }) => {
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '500px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 3
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color={type}>
            {title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Alert severity={type} sx={{ mb: 2 }}>
          <Typography variant="body1">{message}</Typography>
        </Alert>

        <LoadingButton onClick={onClose} variant="contained" fullWidth>
          Close
        </LoadingButton>
      </Paper>
    </Modal>
  );
};

// Trust Payment Status Handler Component
const TrustPaymentHandler = ({ onProcessTrustPayment, isDeveloper, addDebugLog, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusChecked, setStatusChecked] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleTrustPaymentStatus = async () => {
      if (typeof window === 'undefined' || statusChecked) return;

      const urlParams = new URLSearchParams(window.location.search);

      // Check if this is a Trust Payments callback
      const hasTrustParams = urlParams.has('settlestatus') || urlParams.has('errorcode');

      if (!hasTrustParams) {
        setStatusChecked(true);
        return;
      }

      if (isDeveloper) {
        addDebugLog('Trust Payments callback detected', 'info');
        addDebugLog('URL Params:', 'info');
        urlParams.forEach((value, key) => {
          addDebugLog(`${key}: ${value}`, 'info');
        });
      }

      setIsProcessing(true);
      setHasError(false);

      try {
        // Extract Trust Payments parameters
        const settleStatus = urlParams.get('settlestatus');
        const errorCode = urlParams.get('errorcode');
        const orderReference = urlParams.get('orderreference');
        const transactionReference = urlParams.get('transactionreference');
        const siteReference = urlParams.get('sitereference');
        const paymentType = urlParams.get('paymenttypedescription');

        if (isDeveloper) {
          addDebugLog(`Processing Trust Payment: settleStatus=${settleStatus}, errorCode=${errorCode}`, 'info');
        }

        // Process the payment status
        await onProcessTrustPayment({
          settleStatus: parseInt(settleStatus),
          errorCode: errorCode ? parseInt(errorCode) : null,
          orderReference,
          transactionReference,
          siteReference,
          paymentType
        });
      } catch (error) {
        if (isDeveloper) {
          addDebugLog(`Trust Payment processing error: ${error.message}`, 'error');
        }
        setHasError(true);
        onError(error.message);
      } finally {
        setIsProcessing(false);
        setStatusChecked(true);
      }
    };

    handleTrustPaymentStatus();
  }, [onProcessTrustPayment, statusChecked, isDeveloper, addDebugLog, onError]);

  if (isProcessing) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={10}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Verifying your payment...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Please wait while we confirm your payment status with Trust Payments.
        </Typography>
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={10}>
        <Alert severity="error" sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="h6">Payment Verification Failed</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            There was an issue verifying your payment. Please try again or contact support if the problem persists.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return null;
};

const CheckoutMain = () => {
  const router = useRouter();
  const cCurrency = useCurrencyConvert();
  const dispatch = useDispatch();
  const { currency, rate, selectedCountry } = useSelector(({ settings }) => settings);
  const { checkout } = useSelector(({ product }) => product);
  const { user: userData } = useSelector(({ user }) => user);
  const { cart, total } = checkout;
  const [paymentMethod, setPaymentMethod] = useState('apple_pay');
  const [checked, setChecked] = React.useState(false);

  // Check if user is the developer for debugging
  const isDeveloper = userData?.email === 'nowopeyemi@gmail.com';

  // Debug state - only initialize if developer
  const [debugLogs, setDebugLogs] = useState(isDeveloper ? [] : []);
  const [showDebugConsole, setShowDebugConsole] = useState(false);
  const [alertModal, setAlertModal] = useState({
    open: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Trust Payment state
  const [isTrustPaymentCallback, setIsTrustPaymentCallback] = useState(false);
  const [trustPaymentError, setTrustPaymentError] = useState(null);
  const [showCheckoutInterface, setShowCheckoutInterface] = useState(true);

  // Add to debug log - only if developer
  const addDebugLog = useCallback(
    (message, type = 'info') => {
      if (!isDeveloper) return;

      const logEntry = {
        timestamp: new Date(),
        message: typeof message === 'object' ? JSON.stringify(message, null, 2) : message,
        type
      };

      setDebugLogs((prev) => [...prev, logEntry]);

      // Also show important errors as alerts - only if developer
      if (type === 'error' && isDeveloper) {
        setAlertModal({
          open: true,
          title: 'Error',
          message: typeof message === 'object' ? JSON.stringify(message, null, 2) : message,
          type: 'error'
        });
      }
    },
    [isDeveloper]
  );

  const handleChangeShipping = (event) => {
    setChecked(event.target.checked);
  };

  const [couponCode, setCouponCode] = useState(null);
  const [isProcessing, setProcessingTo] = useState(false);
  const [totalWithDiscount, setTotalWithDiscount] = useState(null);

  const { mutate, isLoading } = useMutation('order', api.placeOrder, {
    onSuccess: (data) => {
      if (isDeveloper) {
        addDebugLog('Order placed successfully', 'success');
        addDebugLog(data, 'info');
      }

      localStorage.removeItem('trustPaymentUserDetails');
      toast.success(
        "🎉 Your order was successful! We've emailed you the download link. You can also find it anytime in the 'My Orders' section of your account."
      );
      setProcessingTo(false);
      router.push(`/order/${data.orderId}`);
      dispatch(resetCart());
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || 'Something went wrong';

      if (isDeveloper) {
        addDebugLog(`Order error: ${errorMsg}`, 'error');
        addDebugLog(err, 'error');
      }

      localStorage.removeItem('trustPaymentUserDetails');
      toast.error(errorMsg);
      setProcessingTo(false);
      // Show checkout interface again on order error
      setShowCheckoutInterface(true);
    }
  });

  // Cart sync mutation - syncs Redux cart to backend
  const [loading, setLoading] = React.useState(true);
  const { mutate: getCartMutate } = useMutation(api.getCart, {
    onSuccess: (res) => {
      if (isDeveloper) {
        addDebugLog('Cart synced successfully', 'success');
      }
      dispatch(getCart(res.data));
      setLoading(false);
    },
    onError: (err) => {
      const message = err.response?.data?.message || 'Failed to sync cart';
      setLoading(false);

      if (isDeveloper) {
        addDebugLog(`Cart sync error: ${message}`, 'error');
        addDebugLog(err, 'error');
      }

      toast.error(message || 'We ran into an issue. Please refresh the page or try again.');
    }
  });

  const handleTrustPaymentCallback = useCallback(
    async (trustData) => {
      const { settleStatus, errorCode, orderReference, transactionReference, siteReference, paymentType } = trustData;

      // Check if payment was successful
      const isSuccess = settleStatus === 0 && errorCode === 0;

      if (isSuccess) {
        // Retrieve user details from localStorage
        const storedUserDetails = localStorage.getItem('trustPaymentUserDetails');
        let userDataToUse = valuesRef.current;

        if (storedUserDetails) {
          try {
            userDataToUse = JSON.parse(storedUserDetails);
          } catch (error) {
            console.error('Error parsing stored user details:', error);
          }
        }

        // Prepare order data
        const items = cart.map(({ ...others }) => others);
        const totalItems = sum(items.map((item) => item.quantity));

        const orderData = {
          paymentMethod: `Trust Payments`,
          items: items,
          user: {
            firstName: userDataToUse.billingFirstName || userDataToUse.firstName || '',
            lastName: userDataToUse.billingLastName || userDataToUse.lastName || '',
            email: userDataToUse.billingEmail || userDataToUse.email || ''
          },
          totalItems,
          couponCode: couponCode || null,
          currency: 'GBP',
          conversionRate: rate,
          shipping: process.env.SHIPPING_FEE || 0,
          paymentId: transactionReference,
          description: `Order from Trust Payments - ${transactionReference}`
        };

        if (isDeveloper) {
          addDebugLog('Submitting Trust Payment order', 'info');
          addDebugLog(orderData, 'info');
        }

        mutate(orderData);
      } else {
        // Only clean up on failure
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

        if (isDeveloper) {
          addDebugLog(`Trust Payment failed: ${errorMessage}`, 'error');
        }

        toast.error(errorMessage);
        setProcessingTo(false);
        setShowCheckoutInterface(true);
      }
    },
    [cart, couponCode, rate, mutate, isDeveloper, addDebugLog]
  );

  // Handle Trust Payment processing errors
  const handleTrustPaymentError = useCallback((errorMessage) => {
    setTrustPaymentError(errorMessage);
    setShowCheckoutInterface(true);
    toast.error('Failed to process payment status. Please try again.');
  }, []);

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
      // For credit card payments only (if you add this later)
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

        // Handle credit card submission here
        console.log('Credit card payment data:', data);
      }
    }
  });

  const { errors, values, touched, handleSubmit, getFieldProps } = formik;

  // Check form validity
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

  const valuesRef = useRef(formik.values);

  // Update the ref whenever values change
  useEffect(() => {
    valuesRef.current = formik.values;
  }, [formik.values]);

  // Initialize component - sync cart to backend
  React.useEffect(() => {
    formik.validateForm();

    if (!cart || cart.length < 1) {
      router.push('/');
    } else {
      setLoading(true);
      // Sync Redux cart to backend (same as old version)
      getCartMutate(cart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if we're processing a Trust Payment callback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const hasTrustParams = urlParams.has('settlestatus') || urlParams.has('errorcode');
      setIsTrustPaymentCallback(hasTrustParams);
      setShowCheckoutInterface(!hasTrustParams);
    }
  }, []);

  // Clear debug logs
  const clearDebugLogs = () => {
    setDebugLogs([]);
  };

  // If we're processing a Trust Payment callback, show the handler
  if (isTrustPaymentCallback && !showCheckoutInterface) {
    return (
      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Loading...
            </Typography>
          </Box>
        }
      >
        <TrustPaymentHandler
          onProcessTrustPayment={handleTrustPaymentCallback}
          onError={handleTrustPaymentError}
          isDeveloper={isDeveloper}
          addDebugLog={addDebugLog}
        />
      </Suspense>
    );
  }

  // Show regular checkout interface
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

              <TrustPaymentMethodCard
                value={paymentMethod}
                setValue={setPaymentMethod}
                showApplePay={true}
                useMockMode={false}
                amount={totalWithDiscount || total}
                currency={currency || 'GBP'}
                orderReference={Date.now()}
                isFormValid={isFormValid}
                loading={isLoading || isProcessing || loading}
                disabled={!isFormValid}
                userDetails={{
                  billingFirstName: values.firstName,
                  billingLastName: values.lastName,
                  billingEmail: values.email,
                  billingCountry: selectedCountry || 'GB'
                }}
              />
              <br />
            </Grid>
          </Grid>
        </Box>
      </Form>

      {/* Debug Console - Only show for developer */}
      {isDeveloper && (
        <DebugConsole
          logs={debugLogs}
          onClear={clearDebugLogs}
          open={showDebugConsole}
          onClose={() => setShowDebugConsole(!showDebugConsole)}
        />
      )}

      {/* Response Alert Modal - Only show for developer */}
      {isDeveloper && (
        <ResponseAlertModal
          open={alertModal.open}
          onClose={() => setAlertModal({ ...alertModal, open: false })}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
        />
      )}
    </FormikProvider>
  );
};

export default CheckoutMain;
