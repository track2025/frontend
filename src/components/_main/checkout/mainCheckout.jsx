'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next-nprogress-bar';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { sum } from 'lodash';
// mui
import { Box, Collapse, Grid, Typography, Modal, Paper, IconButton, Alert } from '@mui/material';
import { Close, BugReport } from '@mui/icons-material';
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
                No logs yet. Apple Pay interactions will appear here.
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

  // Ref to track if we've already attempted to initialize Apple Pay
  const applePayInitialized = useRef(false);

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
  const [checkoutError, setCheckoutError] = useState(null);
  const [isProcessing, setProcessingTo] = useState(false);
  const [totalWithDiscount, setTotalWithDiscount] = useState(null);
  const elements = useElements();
  const stripe = useStripe();

  const { mutate, isLoading } = useMutation('order', api.placeOrder, {
    onSuccess: (data) => {
      if (isDeveloper) {
        addDebugLog('Order placed successfully', 'success');
        addDebugLog(data, 'info');
      }

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

      toast.error(errorMsg);
      setProcessingTo(false);
    }
  });

  const [loading, setLoading] = React.useState(true);
  const { mutate: getCartMutate } = useMutation(api.getCart, {
    onSuccess: (res) => {
      if (isDeveloper) {
        addDebugLog('Cart loaded successfully', 'success');
      }
      dispatch(getCart(res.data));
      setLoading(false);
    },
    onError: (err) => {
      const message = JSON.stringify(err.response?.data?.message);
      setLoading(false);

      if (isDeveloper) {
        addDebugLog(`Cart error: ${message}`, 'error');
        addDebugLog(err, 'error');
      }

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

  const valuesRef = useRef(formik.values);

  // Update the ref whenever values change
  useEffect(() => {
    valuesRef.current = formik.values;
  }, [formik.values]);

  // Separate Apple Pay handler function
  const handleApplePayPayment = useCallback(
    async (ev) => {
      if (isDeveloper) {
        addDebugLog('Apple Pay payment initiated', 'info');
      }
      setProcessingTo(true);
      try {
        const currentValues = valuesRef.current;

        // 1. Get data from Apple Pay and merge with form data
        const applePayData = {
          firstName: currentValues.firstName || (ev.payerName ? ev.payerName.split(' ')[0] : ''),
          lastName: currentValues.lastName || (ev.payerName ? ev.payerName.split(' ').slice(1).join(' ') : ''),
          email: currentValues.email || ev.payerEmail || ''
        };

        if (isDeveloper) {
          addDebugLog('Apple Pay data collected', 'info');
          addDebugLog(applePayData, 'info');
        }

        // 2. Validate required data
        if (!applePayData.email || !applePayData.firstName || !applePayData.lastName) {
          const errorMsg = 'Missing required information from Apple Pay';
          if (isDeveloper) {
            addDebugLog(errorMsg, 'error');
          }
          throw new Error(errorMsg);
        }

        // 3. Create payment intent with GBP currency
        if (isDeveloper) {
          addDebugLog('Creating payment intent...', 'info');
        }
        const paymentIntentResponse = await api.paymentIntents(totalWithDiscount || total, 'gbp');

        if (isDeveloper) {
          addDebugLog('Payment intent created', 'success');
          addDebugLog(paymentIntentResponse, 'info');
        }

        const { client_secret: clientSecret } = paymentIntentResponse;

        // 4. Confirm payment with proper error handling
        if (isDeveloper) {
          addDebugLog('Confirming payment...', 'info');
        }
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: ev.paymentMethod.id
          },
          { handleActions: false }
        );

        if (isDeveloper) {
          addDebugLog('Payment confirmation result', 'info');
          addDebugLog({ confirmError, paymentIntent }, 'info');
        }

        // 5. Handle payment actions if required
        if (paymentIntent && paymentIntent.status === 'requires_action') {
          if (isDeveloper) {
            addDebugLog('Payment requires additional action', 'info');
          }
          const { error: actionError } = await stripe.handleCardAction(clientSecret);
          if (actionError) {
            if (isDeveloper) {
              addDebugLog(`Action error: ${actionError.message}`, 'error');
            }
            throw new Error(actionError.message);
          }
        }

        if (confirmError) {
          if (isDeveloper) {
            addDebugLog(`Confirm error: ${confirmError.message}`, 'error');
          }
          throw new Error(confirmError.message);
        }

        ev.complete('success');
        if (isDeveloper) {
          addDebugLog('Apple Pay completed successfully', 'success');
        }

        // 6. Prepare and send order data
        const orderData = prepareOrderData(ev.paymentMethod.id, 'Stripe (Apple Pay)');

        // Merge Apple Pay data with form data
        orderData.user = {
          ...orderData.user,
          ...applePayData
        };

        if (isDeveloper) {
          addDebugLog('Submitting order data...', 'info');
          addDebugLog(orderData, 'info');
        }

        mutate(orderData);
      } catch (err) {
        if (isDeveloper) {
          addDebugLog(`Apple Pay error: ${err.message}`, 'error');
        }
        ev.complete('fail');
        setCheckoutError(err.message);
        setProcessingTo(false);

        // Show error alert only for developer
        if (isDeveloper) {
          setAlertModal({
            open: true,
            title: 'Apple Pay Error',
            message: err.message,
            type: 'error'
          });
        }
      }
    },
    [stripe, total, totalWithDiscount, prepareOrderData, mutate, isDeveloper]
  );

  // Initialize Apple Pay
  useEffect(() => {
    const initializeApplePay = async () => {
      if (!stripe || !total || applePayInitialized.current) return;

      applePayInitialized.current = true;
      if (isDeveloper) {
        addDebugLog('Initializing Apple Pay...', 'info');
      }

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

        if (isDeveloper) {
          addDebugLog('Apple Pay availability check', 'info');
          addDebugLog(canMakePayment, 'info');
        }

        if (canMakePayment?.applePay) {
          setPaymentRequest(pr);
          setShowApplePay(true);

          if (isDeveloper) {
            addDebugLog('Apple Pay is available', 'success');
          }

          // Add event listener
          pr.on('paymentmethod', handleApplePayPayment);
          pr.on('cancel', () => {
            if (isDeveloper) {
              addDebugLog('Apple Pay was cancelled by user', 'info');
            }
          });
        } else {
          setShowApplePay(false);
          setPaymentMethod('credit_card');

          if (isDeveloper) {
            addDebugLog('Apple Pay is not available', 'info');
          }
        }
      } catch (error) {
        if (isDeveloper) {
          addDebugLog(`Apple Pay initialization failed: ${error.message}`, 'error');
        }
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
  }, [stripe, total, totalWithDiscount, handleApplePayPayment, isDeveloper]);

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
    if (isDeveloper) {
      addDebugLog('Credit card payment initiated', 'info');
    }
    setProcessingTo(true);
    setCheckoutError(null);

    const billingDetails = {
      name: `${values.firstName} ${values.lastName}`,
      email: values.email
    };

    if (isDeveloper) {
      addDebugLog('Billing details', 'info');
      addDebugLog(billingDetails, 'info');
    }

    const cardElement = elements.getElement('card');
    try {
      if (isDeveloper) {
        addDebugLog('Creating payment intent...', 'info');
      }
      const paymentIntentResponse = await api.paymentIntents(totalWithDiscount || total, 'gbp');

      if (isDeveloper) {
        addDebugLog('Payment intent created', 'success');
        addDebugLog(paymentIntentResponse, 'info');
      }

      const { client_secret: clientSecret } = paymentIntentResponse;

      if (isDeveloper) {
        addDebugLog('Creating payment method...', 'info');
      }
      const paymentMethodReq = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails
      });

      if (isDeveloper) {
        addDebugLog('Payment method creation result', 'info');
        addDebugLog(paymentMethodReq, 'info');
      }

      if (paymentMethodReq?.error) {
        if (isDeveloper) {
          addDebugLog(`Payment method error: ${paymentMethodReq.error.message}`, 'error');
        }
        setCheckoutError(paymentMethodReq.error.message);
        setProcessingTo(false);
        return;
      }

      if (isDeveloper) {
        addDebugLog('Confirming card payment...', 'info');
      }
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodReq?.paymentMethod.id
      });

      if (isDeveloper) {
        addDebugLog('Card payment confirmation result', 'info');
        addDebugLog({ error, paymentIntent }, 'info');
      }

      if (paymentIntent && paymentIntent.status === 'requires_action') {
        if (isDeveloper) {
          addDebugLog('Payment requires additional action', 'info');
        }
        const { error: actionError } = await stripe.handleCardAction(clientSecret);
        if (actionError) {
          if (isDeveloper) {
            addDebugLog(`Action error: ${actionError.message}`, 'error');
          }
          setCheckoutError(actionError.message);
          setProcessingTo(false);
          return;
        }
      }

      if (error) {
        if (isDeveloper) {
          addDebugLog(`Payment error: ${error.message}`, 'error');
        }
        setCheckoutError(error.message);
        setProcessingTo(false);
        return;
      }

      setProcessingTo(false);

      if (isDeveloper) {
        addDebugLog('Credit card payment successful', 'success');
      }

      const orderData = prepareOrderData(paymentMethodReq?.paymentMethod.id);

      if (isDeveloper) {
        addDebugLog('Submitting order data...', 'info');
        addDebugLog(orderData, 'info');
      }

      mutate(orderData);
      return;
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Payment failed';

      if (isDeveloper) {
        addDebugLog(`Payment error: ${errorMsg}`, 'error');
        addDebugLog(err, 'error');
      }

      setCheckoutError(errorMsg);
      setProcessingTo(false);
    }
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    if (isDeveloper) {
      addDebugLog(`Payment method changed to: ${method}`, 'info');
    }
    setPaymentMethod(method);
    setCheckoutError(null);
  };

  // Clear debug logs
  const clearDebugLogs = () => {
    setDebugLogs([]);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noSubmit onSubmit={handleSubmit}>
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

                        if (isDeveloper) {
                          addDebugLog('Form validation failed for Apple Pay', 'error');
                          addDebugLog(fieldErrors, 'error');
                        }

                        toast.error('Please fill all required fields correctly');
                        return false;
                      }

                      if (isDeveloper) {
                        addDebugLog('Form validation passed for Apple Pay', 'success');
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
