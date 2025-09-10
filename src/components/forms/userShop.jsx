'use client';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { setLogout, updateUserRole } from 'src/redux/slices/user';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';
// mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { setLogin } from 'src/redux/slices/user';

import {
  Card,
  Stack,
  TextField,
  Typography,
  Box,
  FormHelperText,
  Grid,
  MenuItem,
  IconButton,
  InputAdornment,
  Link
} from '@mui/material';

// components
import UploadSingleFile from 'src/components/upload/UploadSingleFile';
import countries from 'src/components/_main/checkout/countries.json';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { MdOutlineVisibility } from 'react-icons/md';
import { MdOutlineVisibilityOff } from 'react-icons/md';
import { IoMdMale } from 'react-icons/io';
import { IoMdMail } from 'react-icons/io';
import { MdLock } from 'react-icons/md';
import { IoMdFemale } from 'react-icons/io';
import { IoPerson } from 'react-icons/io5';
import { MdLocalPhone } from 'react-icons/md';
import { FaTransgender } from 'react-icons/fa6';
import { createCookies } from 'src/hooks/cookies';
import parseMongooseError from 'src/utils/errorHandler';

// yup
import * as Yup from 'yup';
// axios
import axios from 'axios';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
// api
import * as api from 'src/services';
import uploadToSpaces from 'src/utils/upload';

CreateShopSettingFrom.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

export default function CreateShopSettingFrom() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [state, setstate] = useState({
    logoLoading: false,
    loading: false,
    name: '',
    search: '',
    open: false
  });

  // const { user, isAuthenticated } = useSelector(({ user }) => user);
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     // Redirect with the current page or fixed redirect path
  //     toast.success('Please log in or register to complete your photographer account creation', {
  //       duration: 10000
  //     });
  //     router.replace('/auth/login?redirect=/create-shop');
  //   }
  // }, []);

  const { data } = useQuery(['get-currencies'], () => api.getCurrencies());
  //Your photographer account is now under review. Please log in again to access your dashboard. You will be redirected to the login page to continue.
  const { mutate, isLoading } = useMutation('new-user-shop', api.addShopByUser, {
    retry: false,
    onSuccess: async (data) => {
      console.log('token', data);
      dispatch(setLogin(data.user));
      //await createCookies('token', data.token);
      // Set both token and role cookies
      const cookieOptions = {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 // 1 day in seconds
      };

      // Set token cookie
      document.cookie = `token=${data.token}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`;

      // Set role cookie (for middleware access)
      document.cookie = `userRole=${data.user.role}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`;
      // document.cookie = `isVerified=${data.user.isVerified}; ${Object.entries(cookieOptions)
      //   .map(([key, value]) => `${key}=${value}`)
      //   .join('; ')}`;
      toast.success(
        'We’ve sent a one-time password (OTP) to your email. Please enter it to verify your email address and finish setting up your photographer account.',
        {
          duration: 10000 // Prevents auto-dismissal
        }
      );
      //dispatch(updateUserRole());
      //dispatch(setLogout());
      //router.replace('/auth/login');
      setTimeout(() => {
        router.push(`/auth/verify-otp?redirect=%2Fvendor%2Fdashboard`);
      }, 3000);
    },
    onError: (error) => {
      let errorMessage = parseMongooseError(error?.message);
      toast.error(errorMessage, {
        duration: 10000 // Prevents auto-dismissal
      });
    }
  });

  const [showPassword, setShowPassword] = useState(false);

  const ShopSettingScema = Yup.object().shape({
    username: Yup.string()
      .required('username is required')
      .matches(
        /^[a-zA-Z0-9][a-zA-Z0-9._]{2,29}$/,
        'Username must start with a letter or number and can contain letters, numbers, dots, and underscores. Length must be between 3 and 30 characters.'
      ),
    // cover: Yup.mixed().required('Cover is required'),
    // logo: Yup.mixed().required('logo is required'),
    //slug: Yup.string().required('Slug is required'),
    // description: Yup.string().required('Payoff line is required'),
    // phone: Yup.string().required('Phone Number is required'),
    defaultPrice: Yup.number().required('Default Price is required'),
    firstName: Yup.string().max(50, 'Too long!').required('First name is required'),
    lastName: Yup.string().max(50, 'Too long!').required('Last name is required'),
    email: Yup.string().email('Enter valid email').required('Email is required'),
    password: Yup.string().required('Password is required').min(8, 'Password should be 8 characters or longer.')
  });
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      password: '',
      email: '',
      username: '',
      cover: null,
      logo: null,
      description: '',
      file: '',
      slug: '',
      phone: '',
      defaultCurrency: 'AED',
      defaultPrice: 100,
      paymentInfo: {
        holderName: '',
        holderEmail: ''
        // bankName: '',
        // AccountNo: ''
      },
      address: {
        country: 'United Arab Emirates',
        city: '',
        state: '',
        streetAddress: ''
      }
    },
    enableReinitialize: true,
    validationSchema: ShopSettingScema,
    onSubmit: async (values) => {
      const { file, ...rest } = values;
      try {
        mutate({
          ...rest
        });
      } catch (error) {
        //console.error(error);
      }
    }
  });
  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  const handleDropLogo = async (acceptedFiles) => {
    setstate({ ...state, logoLoading: 2 });
    const file = acceptedFiles[0];
    if (file) {
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      });
    }
    setFieldValue('file', file);
    try {
      const uploaded = await uploadToSpaces(file, (progress) => {
        setstate({ ...state, logoLoading: progress });
      });

      setFieldValue('logo', uploaded);

      if (values.file && values.logo?._id) {
        deleteMutate(values.logo._id);
      }

      setstate({ ...state, logoLoading: false });
    } catch (err) {
      console.error('Upload failed:', err);
      setstate({ ...state, logoLoading: false });
    }
  };

  const handleDropCover = async (acceptedFiles) => {
    setstate({ ...state, loading: 2 });
    const file = acceptedFiles[0];
    if (file) {
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      });
    }
    setFieldValue('file', file);
    try {
      const uploaded = await uploadToSpaces(file, (progress) => {
        setstate({ ...state, loading: progress });
      });

      setFieldValue('cover', uploaded);

      if (values.file && values.cover?._id) {
        deleteMutate(values.cover._id);
      }

      setstate({ ...state, loading: false });
    } catch (err) {
      console.error('Upload failed:', err);
      setstate({ ...state, loading: false });
    }
  };

  const handleTitleChange = (event) => {
    const title = event.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]+/g, '')
      .replace(/\s+/g, '-'); // convert to lowercase, remove special characters, and replace spaces with hyphens
    formik.setFieldValue('slug', slug); // set the value of slug in the formik state
    formik.handleChange(event); // handle the change in formik
  };

  return (
    <Box position="relative">
      <Typography variant="h2" color="text-primary" py={6}>
        Create your photographer profile
      </Typography>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid
              item
              sx={{
                width: {
                  xs: '100%', // mobile
                  md: '60%' // desktop
                }
              }}
            >
              <Card sx={{ p: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Stack gap={0.5} width={1}>
                    <LabelStyle color="text.primary" htmlFor="firstName" component={'label'}>
                      First Name
                    </LabelStyle>
                    <TextField
                      id="firstName"
                      fullWidth
                      type="text"
                      {...getFieldProps('firstName')}
                      error={Boolean(touched.firstName && errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IoPerson size={24} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Stack>
                  <Stack gap={0.5} width={1}>
                    <LabelStyle color="text.primary" htmlFor="lastName" component={'label'}>
                      Last Name
                    </LabelStyle>
                    <TextField
                      fullWidth
                      id="lastName"
                      type="text"
                      {...getFieldProps('lastName')}
                      error={Boolean(touched.lastName && errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IoPerson size={24} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Stack>
                </Stack>
                <Stack mt={3} spacing={2} width={1}>
                  <LabelStyle color="text.primary" htmlFor="email" component={'label'}>
                    Email
                  </LabelStyle>
                  <TextField
                    id="email"
                    fullWidth
                    autoComplete="username"
                    type="email"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IoMdMail size={24} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Stack>
                <Stack mt={3} spacing={2} width={1}>
                  <LabelStyle color="text.primary" htmlFor="password" component={'label'}>
                    Password
                  </LabelStyle>
                  <TextField
                    id="password"
                    fullWidth
                    autoComplete="current-password"
                    type={showPassword ? 'text' : 'password'}
                    {...getFieldProps('password')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MdLock size={24} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                            {showPassword ? <MdOutlineVisibility size={24} /> : <MdOutlineVisibilityOff size={24} />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </Stack>
                <Box sx={{ width: '100%' }} mt={3}>
                  <div>
                    <LabelStyle component={'label'} htmlFor="username">
                      Username
                    </LabelStyle>

                    <TextField
                      id="username"
                      fullWidth
                      {...getFieldProps('username')}
                      onChange={handleTitleChange} // add onChange handler for title
                      error={Boolean(touched.username && errors.username)}
                      helperText={touched.username && errors.username}
                      sx={{}}
                    />
                  </div>
                </Box>
                {/* <Stack mt={3} spacing={3} direction="row" flexGrow="wrap">
                  <Box sx={{ width: '100%' }}>
                    <LabelStyle component={'label'} htmlFor="description">
                      {' '}
                      {'Pay Off Line'}{' '}
                    </LabelStyle>

                    <TextField
                      fullWidth
                      id="description"
                      {...getFieldProps('description')}
                      error={Boolean(touched.description && errors.description)}
                      helperText={touched.description && errors.description}
                      rows={3}
                      multiline
                    />
                  </Box>
                </Stack> */}
                <Stack mt={3} spacing={2} direction="row" spacing={3} flexGrow="wrap">
                  <Box sx={{ width: '100%' }}>
                    <LabelStyle>Default Price</LabelStyle>

                    <Stack direction="row" spacing={2}>
                      <TextField
                        select
                        label="Currency"
                        fullWidth
                        {...getFieldProps('defaultCurrency')}
                        error={Boolean(touched.defaultCurrency && errors.defaultCurrency)}
                        helperText={touched.defaultCurrency && errors.defaultCurrency}
                      >
                        {data?.data?.map((cur, index) => (
                          <MenuItem key={index} value={cur.code}>
                            {cur.code}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        type="number"
                        label={`Price (${values.defaultCurrency})`}
                        fullWidth
                        {...getFieldProps('defaultPrice')}
                        error={Boolean(touched.defaultPrice && errors.defaultPrice)}
                        helperText={touched.defaultPrice && errors.defaultPrice}
                      />
                    </Stack>
                  </Box>
                </Stack>
                <Box mt={3}>
                  <Stack direction="row" justifyContent="space-between">
                    <LabelStyle variant="body1" component={'label'} color="text.primary">
                      Logo
                    </LabelStyle>

                    <LabelStyle component={'label'} htmlFor="file">
                      <span></span>
                    </LabelStyle>
                  </Stack>

                  <UploadSingleFile
                    id="file"
                    file={values.logo}
                    onDrop={handleDropLogo}
                    error={Boolean(touched.logo && errors.logo)}
                    category
                    accept={{
                      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
                    }}
                    loading={state.logoLoading}
                    maxSize={1 * 1024 * 1024} // 2MB
                  />

                  {touched.logo && errors.logo && (
                    <FormHelperText error sx={{ px: 2, mx: 0 }}>
                      {touched.logo && errors.logo}
                    </FormHelperText>
                  )}
                </Box>
                <Box mt={3}>
                  <Stack direction="row" justifyContent="space-between">
                    <LabelStyle variant="body1" component={'label'} color="text.primary">
                      Cover
                    </LabelStyle>

                    <LabelStyle component={'label'} htmlFor="file">
                      <span></span>
                    </LabelStyle>
                  </Stack>

                  <UploadSingleFile
                    id="file"
                    file={values.cover}
                    onDrop={handleDropCover}
                    error={Boolean(touched.cover && errors.cover)}
                    category
                    accept={{
                      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
                    }}
                    maxSize={2 * 1024 * 1024} // 2MB
                    loading={state.loading}
                  />

                  {touched.cover && errors.cover && (
                    <FormHelperText error sx={{ px: 2, mx: 0 }}>
                      {touched.cover && errors.cover}
                    </FormHelperText>
                  )}
                </Box>{' '}
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isLoading}
                  sx={{ ml: 'auto', mt: 3 }}
                >
                  Sign Up
                </LoadingButton>
              </Card>
            </Grid>

            <Grid
              item
              sx={{
                width: {
                  xs: '100%', // mobile
                  md: '30%' // desktop
                }
              }}
            ></Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
