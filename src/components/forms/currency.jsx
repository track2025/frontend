'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';

// mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Stack,
  TextField,
  Typography,
  Box,
  Select,
  FormControl,
  FormHelperText,
  Grid,
  Skeleton
} from '@mui/material';
// api
import * as api from 'src/services';
// yup
import * as Yup from 'yup';
// axios
import axios from 'axios';
// toast
import toast from 'react-hot-toast';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
import UploadSingleFile from 'src/components/upload/UploadSingleFile';
// next
import { useRouter } from 'next/navigation';
const currencies = [
  {
    name: 'US Dollar',
    code: 'USD',
    country: 'United States'
  },
  {
    name: 'Pakistani Rupee',
    code: 'PKR',
    country: 'Pakistan'
  },
  {
    name: 'Indian Rupee',
    code: 'INR',
    country: 'India'
  },
  {
    name: 'Saudi Riyal',
    code: 'SAR',
    country: 'Saudi Arabia'
  },
  {
    name: 'Euro',
    code: 'EUR',
    country: 'European Union' // Eurozone
  }
];
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

const STATUS_OPTIONS = ['active', 'disabled'];

export default function BrandsForm({ data: currentCurrency, isLoading: currencyLoading }) {
  const router = useRouter();

  const { mutate, isLoading } = useMutation(
    currentCurrency ? 'update currency' : 'new currency',
    currentCurrency ? api.updateCurrency : api.addCurrency,
    {
      ...(currentCurrency && {
        enabled: Boolean(currentCurrency)
      }),
      retry: false,
      onSuccess: (data) => {
        toast.success(data.message);
        router.push('/admin/currencies');
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      }
    }
  );
  const CurrencySchema = Yup.object().shape({
    rate: Yup.number()
  });
  console.log(currentCurrency, 'currentCurrency');
  const formik = useFormik({
    initialValues: {
      currency: currentCurrency?.code || currencies[0].code,
      rate: currentCurrency?.rate || '',
      status: currentCurrency?.status || 'active'
    },
    enableReinitialize: true,
    validationSchema: CurrencySchema,
    onSubmit: async (values) => {
      try {
        const { currency, ...others } = values;
        mutate({
          ...others,
          ...currencies.find((cur) => cur.code === currency),
          ...(currentCurrency && {
            _id: currentCurrency._id
          })
        });
      } catch (error) {
        console.error(error);
      }
    }
  });
  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <FormControl fullWidth sx={{ select: { textTransform: 'capitalize' } }}>
                    {currencyLoading ? (
                      <Skeleton variant="text" width={70} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="currency">
                        {'Currency'}
                      </LabelStyle>
                    )}

                    {currencyLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <Select
                        id="currency"
                        native
                        {...getFieldProps('currency')}
                        error={Boolean(touched.currency && errors.currency)}
                      >
                        <option value="" style={{ display: 'none' }} />
                        {currencies.map((currency) => (
                          <option key={currency.code} value={currency.code} style={{ textTransform: 'capitalize' }}>
                            {currency.name} ({currency.code})
                          </option>
                        ))}
                      </Select>
                    )}
                    {touched.currency && errors.currency && (
                      <FormHelperText error sx={{ px: 2, mx: 0 }}>
                        {touched.currency && errors.currency}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <div>
                    {currencyLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="currency-rate">
                        Currency rate
                      </LabelStyle>
                    )}
                    {currencyLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="currency-rate"
                        fullWidth
                        type="number"
                        {...getFieldProps('rate')}
                        error={Boolean(touched.rate && errors.rate)}
                        helperText={touched.rate && errors.rate}
                      />
                    )}
                  </div>
                  <FormControl fullWidth sx={{ select: { textTransform: 'capitalize' } }}>
                    {currencyLoading ? (
                      <Skeleton variant="text" width={70} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="brand-status">
                        {'Status'}
                      </LabelStyle>
                    )}
                    {currencyLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <Select
                        id="brand-status"
                        native
                        {...getFieldProps('status')}
                        error={Boolean(touched.status && errors.status)}
                      >
                        <option value="" style={{ display: 'none' }} />
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status} style={{ textTransform: 'capitalize' }}>
                            {status}
                          </option>
                        ))}
                      </Select>
                    )}
                    {touched.status && errors.status && (
                      <FormHelperText error sx={{ px: 2, mx: 0 }}>
                        {touched.status && errors.status}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Stack>
              </Card>
              {currencyLoading ? (
                <Skeleton variant="rectangular" width="100%" height={56} />
              ) : (
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isLoading}
                  sx={{ ml: 'auto', mt: 3 }}
                >
                  {currentCurrency ? 'Edit Currency' : 'Create Curreny'}
                </LoadingButton>
              )}
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
BrandsForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};
