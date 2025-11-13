'use client';

import React from 'react';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';

// material ui
import { Box, Stack, Grid, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// yup
import * as Yup from 'yup';
// formik
import { useFormik, Form, FormikProvider } from 'formik';

// services
import * as api from 'src/services';

const ContactUs = () => {
  const ContactSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    firstName: Yup.string()
      .required('First name is required')
      .max(50, 'First name cannot exceed 50 characters'),
    lastName: Yup.string()
      .required('Last name is required')
      .max(50, 'Last name cannot exceed 50 characters'),
    phone: Yup.string()
      .matches(/^[0-9+\-\s()]*$/, 'Please enter a valid phone number')
      .max(20, 'Phone number cannot exceed 20 characters'),
    message: Yup.string()
      .required('Message is required')
      .max(1000, 'Message cannot exceed 1000 characters')
      .min(10, 'Message should be at least 10 characters')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      message: ''
    },
    validationSchema: ContactSchema,
    onSubmit: async (values, { resetForm }) => {
      mutate(values);
    }
  });

  const { errors, touched, handleSubmit, getFieldProps, resetForm } = formik;

  const { mutate, isLoading } = useMutation(api.contactUs, {
    onSuccess: (data) => {
      resetForm();
      toast.success(data.message || 'Message sent successfully! We will get back to you soon.');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
    }
  });

  return (
    <div>
      {/* form section */}
      <Stack className="form-section">
        <Box className="form-feed">
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} sx={{ width: { xs: '100%', md: 'auto' } }}>
                  <TextField
                    label={'First Name'}
                    className="text-feed"
                    fullWidth
                    {...getFieldProps('firstName')}
                    error={Boolean(touched.firstName && errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ width: { xs: '100%', md: 'auto' } }}>
                  <TextField
                    label={'Last Name'}
                    className="text-feed"
                    fullWidth
                    {...getFieldProps('lastName')}
                    error={Boolean(touched.lastName && errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </Grid>
              </Grid>
              
              {/* Email && Phone */}
              <Grid container spacing={3} mt={{ md: 3, xs: 3 }}>
                <Grid item xs={12} md={6} sx={{ width: { xs: '100%', md: 'auto' } }}>
                  <TextField
                    label={'Your Email'}
                    className="text-feed"
                    fullWidth
                    type="email"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ width: { xs: '100%', md: 'auto' } }}>
                  <TextField
                    label={'Your Phone'}
                    className="text-feed"
                    fullWidth
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>
              </Grid>

              {/* Your message */}
              <Grid item xs={12} mt={3}>
                <TextField
                  label={'Your Message'}
                  className="text-feed"
                  multiline
                  rows={5}
                  fullWidth
                  {...getFieldProps('message')}
                  error={Boolean(touched.message && errors.message)}
                  helperText={touched.message && errors.message}
                />
              </Grid>

              <LoadingButton
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                className="send-btn"
                loading={isLoading}
                sx={{
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  mt: 3
                }}
              >
                Send Message
              </LoadingButton>
            </Form>
          </FormikProvider>
        </Box>
      </Stack>
    </div>
  );
};

export default ContactUs;