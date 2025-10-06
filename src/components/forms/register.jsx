'use client';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { setLogout, updateUserRole } from 'src/redux/slices/user';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';
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
  Link,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';
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
import * as Yup from 'yup';
import axios from 'axios';
import { Form, FormikProvider, useFormik } from 'formik';
import * as api from 'src/services';
import uploadToSpaces from 'src/utils/upload';
import { useSearchParams } from 'next/navigation';

RegisterForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

export default function RegisterForm() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const dispatch = useDispatch();
  const [userType, setUserType] = useState('photographer');
  const redirect = searchParam.get('redirect');
  const [loading, setloading] = useState(false);
  const [state, setState] = useState({
    logoLoading: false,
    loading: false,
    name: '',
    search: '',
    open: false
  });

  const [showPassword, setShowPassword] = useState(false);

  const { data } = useQuery(['get-currencies'], () => api.getCurrencies());

  // Mutation for photographer registration
  const { mutate: createShop, isLoading: isCreatingShop } = useMutation('new-user-shop', api.addShopByUser, {
    retry: false,
    onSuccess: async (data) => {
      dispatch(setLogin(data.user));
      const cookieOptions = {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400
      };

      document.cookie = `token=${data.token}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`;

      document.cookie = `userRole=${data.user.role}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`;

      toast.success(
        "We've sent a one-time password (OTP) to your email. Please enter it to verify your email address and finish setting up your photographer account.",
        { duration: 10000 }
      );

      setTimeout(() => {
        router.push(`/auth/verify-otp?redirect=%2Fvendor%2Fdashboard`);
      }, 3000);
    },
    onError: (error) => {
      let errorMessage = parseMongooseError(error?.message);
      toast.error(errorMessage, { duration: 10000 });
    }
  });

  // Mutation for user registration
  const { mutate: registerUser, isLoading: isRegistering } = useMutation(api.register, {
    onSuccess: async (data) => {
      dispatch(setLogin(data.user));
      const cookieOptions = {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400
      };

      document.cookie = `token=${data.token}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`;
      document.cookie = `userRole=${data.user.role}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`;

      toast.success(
        `Welcome, ${data.user.firstName}! You're all set. Start exploring and shop amazing track race photos and videos from your favorite photographers. An OTP has been sent to ${data.user.email}, please verify your account.`,
        { duration: 10000 }
      );

      //toast.success(`Welcome, ${data.user.firstName}! We’ve sent a one-time password (OTP) to your email. Please check your inbox.`);
      setloading(false);
      //dispatch(verifyUser());
      //router.push(redirect || '/');
      router.push(redirect ? `/auth/verify-otp?redirect=${redirect}` : `/auth/verify-otp`);
    },
    onError: (err) => {
      let errorMessage = parseMongooseError(err?.message);
      toast.error(errorMessage || 'We ran into an issue. Please refresh the page or try again.', {
        duration: 10000
      });
    }
  });

  const ShopSettingSchema = Yup.object().shape({
    username: Yup.string()
      .required('username is required')
      .matches(
        /^[a-zA-Z0-9][a-zA-Z0-9._]{2,29}$/,
        'Username must start with a letter or number and can contain letters, numbers, dots, and underscores. Length must be between 3 and 30 characters.'
      ),
    defaultPrice: Yup.number().required('Default Price is required'),
    firstName: Yup.string().max(50, 'Too long!').required('First name is required'),
    lastName: Yup.string().max(50, 'Too long!').required('Last name is required'),
    email: Yup.string().email('Enter valid email').required('Email is required'),
    password: Yup.string().required('Password is required').min(8, 'Password should be 8 characters or longer.')
  });

  const UserSchema = Yup.object().shape({
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
      },
      address: {
        country: 'United Arab Emirates',
        city: '',
        state: '',
        streetAddress: ''
      }
    },
    enableReinitialize: true,
    validationSchema: userType === 'photographer' ? ShopSettingSchema : UserSchema,
    onSubmit: async (values) => {
      if (userType === 'photographer') {
        const { file, ...rest } = values;
        try {
          createShop({
            ...rest
          });
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          registerUser({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password
          });
        } catch (error) {
          console.error(error);
        }
      }
    }
  });

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  const handleDropLogo = async (acceptedFiles) => {
    setState({ ...state, logoLoading: 2 });
    const file = acceptedFiles[0];
    if (file) {
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      });
    }
    setFieldValue('file', file);
    try {
      const uploaded = await uploadToSpaces(file, (progress) => {
        setState({ ...state, logoLoading: progress });
      });

      setFieldValue('logo', uploaded);
      setState({ ...state, logoLoading: false });
    } catch (err) {
      console.error('Upload failed:', err);
      setState({ ...state, logoLoading: false });
    }
  };

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  function getCroppedImg(imageSrc, croppedAreaPixels) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          blob.name = 'cropped.jpeg';
          resolve(new File([blob], 'cropped.jpeg', { type: 'image/jpeg' }));
        }, 'image/jpeg');
      };
      image.onerror = reject;
    });
  }

  const handleDropCover = (acceptedFiles) => {
    setState({ ...state, loading: 2 });
    const file = acceptedFiles[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImageSrc(preview);
    setCropModalOpen(true); // open cropper instead of uploading immediately
  };

  // const handleDropCover = async (acceptedFiles) => {
  //   setState({ ...state, loading: 2 });
  //   const file = acceptedFiles[0];
  //   if (file) {
  //     Object.assign(file, {
  //       preview: URL.createObjectURL(file)
  //     });
  //   }
  //   setFieldValue('file', file);
  //   try {
  //     const uploaded = await uploadToSpaces(file, (progress) => {
  //       setState({ ...state, loading: progress });
  //     });

  //     setFieldValue('cover', uploaded);
  //     setState({ ...state, loading: false });
  //   } catch (err) {
  //     console.error('Upload failed:', err);
  //     setState({ ...state, loading: false });
  //   }
  // };

  const handleTitleChange = (event) => {
    const title = event.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]+/g, '')
      .replace(/\s+/g, '-');
    formik.setFieldValue('slug', slug);
    formik.handleChange(event);
  };

  return (
    <>
      <Dialog open={cropModalOpen} onClose={() => setCropModalOpen(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ position: 'relative', height: 400, background: '#333' }}>
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={5 / 1} // enforce 5:1 ratio
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(croppedArea, croppedAreaPixels) => {
                setCroppedAreaPixels(croppedAreaPixels);
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCropModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);

                //setFieldValue('file', file);
                //   try {
                //     const uploaded = await uploadToSpaces(file, (progress) => {
                //       setState({ ...state, loading: progress });
                //     });

                //     setFieldValue('cover', uploaded);
                //     setState({ ...state, loading: false });
                //   }

                setFieldValue('file', croppedFile);

                // Now upload cropped file
                setState({ ...state, loading: 2 });
                const uploaded = await uploadToSpaces(croppedFile, (progress) => {
                  setState({ ...state, loading: progress });
                });

                setFieldValue('cover', uploaded);
                setState({ ...state, loading: false });

                if (values.file && values.cover?._id) {
                  deleteMutate(values.cover._id);
                }
              } catch (e) {
                console.error(e);
              }
              setCropModalOpen(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Box position="relative">
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container justifyContent="center">
              <Grid item xs={12} md={8} lg={6}>
                {/* User Type Selection */}
                <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
                  <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold' }}>
                    I want to register as a:
                  </FormLabel>
                  <RadioGroup
                    row
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    sx={{ justifyContent: 'center' }}
                  >
                    <FormControlLabel
                      value="photographer"
                      control={<Radio color="primary" />}
                      label="Photographer"
                      sx={{ mr: 4 }}
                    />
                    <FormControlLabel value="user" control={<Radio color="primary" />} label="User" />
                  </RadioGroup>
                </FormControl>

                {/* Common Fields */}
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

                {/* Photographer-specific Fields */}
                {userType === 'photographer' && (
                  <>
                    <Box sx={{ width: '100%' }} mt={3}>
                      <div>
                        <LabelStyle component={'label'} htmlFor="username">
                          Username
                        </LabelStyle>
                        <TextField
                          id="username"
                          fullWidth
                          {...getFieldProps('username')}
                          onChange={handleTitleChange}
                          error={Boolean(touched.username && errors.username)}
                          helperText={touched.username && errors.username}
                        />
                      </div>
                    </Box>

                    <Stack mt={3} spacing={2} direction="row" flexGrow="wrap">
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
                        maxSize={1 * 1024 * 1024}
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
                          Cover Image
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
                        maxSize={2 * 1024 * 1024}
                        loading={state.loading}
                      />
                      {touched.cover && errors.cover && (
                        <FormHelperText error sx={{ px: 2, mx: 0 }}>
                          {touched.cover && errors.cover}
                        </FormHelperText>
                      )}
                    </Box>
                  </>
                )}

                <Typography variant="body2" align="center" color="text.secondary" mt={3}>
                  By registering, I agree to Lap Snaps&nbsp;
                  <Link underline="always" color="primary" href="/terms-and-conditions" fontWeight={700}>
                    Terms
                  </Link>
                  &nbsp;and&nbsp;
                  <Link underline="always" color="primary" href="/privacy-policy" fontWeight={700}>
                    Privacy policy
                  </Link>
                  .
                </Typography>

                <LoadingButton
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={userType === 'photographer' ? isCreatingShop : isRegistering}
                  sx={{ mt: 3, py: 1.5 }}
                >
                  {userType === 'photographer' ? 'Create Photographer Account' : 'Create User Account'}
                </LoadingButton>

                <Typography variant="subtitle2" mt={3} textAlign="center">
                  Already have an account? &nbsp;
                  <Link href="/auth/login" color="primary" fontWeight={600}>
                    Login
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Box>
    </>
  );
}
