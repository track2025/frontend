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
  Link
} from '@mui/material';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import UploadSingleFile from 'src/components/upload/UploadSingleFile';

import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { MdOutlineVisibility } from 'react-icons/md';
import { MdOutlineVisibilityOff } from 'react-icons/md';
import { IoMdMail } from 'react-icons/io';
import { MdLock } from 'react-icons/md';
import { IoPerson } from 'react-icons/io5';
import { createCookies } from 'src/hooks/cookies';
import parseMongooseError from 'src/utils/errorHandler';
import * as Yup from 'yup';
import axios from 'axios';
import { Form, FormikProvider, useFormik } from 'formik';
import * as api from 'src/services';
import uploadToSpaces from 'src/utils/upload';
import { useSearchParams } from 'next/navigation';
import countries from 'src/utils/counties';

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
      toast.success(
        "We've sent a one-time password (OTP) to your email. Please enter it to verify your email address and finish setting up your photographer account.",
        { duration: 10000 }
      );

      // Redirect to OTP verification with tempUserId
      setTimeout(() => {
        router.push(`/auth/verify-otp?tempUserId=${data.tempUserId}`);
      }, 2000);
    },
    onError: (error) => {
      let errorMessage = parseMongooseError(error?.message);
      toast.error(errorMessage, { duration: 10000 });
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
    country: Yup.string().required('Country is required'),
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
      country: 'AE',
      defaultCurrency: 'AED',
      defaultPrice: 100,
      paymentInfo: {
        holderName: '',
        holderEmail: ''
      },
      address: {
        country: 'AE',
        city: '',
        state: '',
        streetAddress: ''
      }
    },
    enableReinitialize: true,
    validationSchema: ShopSettingSchema,
    onSubmit: async (values) => {
      const { file, country, ...rest } = values;

      const selectedCountry = countries.find(c => c.code === country);

      const payload = {
        ...rest,
        address: {
          ...values.address,
          country: {
            code: selectedCountry?.code || values.address.country,
            name: selectedCountry?.label || '',
          },
        },
      };

      try {
        createShop(payload);
      } catch (error) {
        console.error(error);
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

                setFieldValue('file', croppedFile);

                // Now upload cropped file
                setState({ ...state, loading: 2 });
                const uploaded = await uploadToSpaces(croppedFile, (progress) => {
                  setState({ ...state, loading: progress });
                });

                setFieldValue('cover', uploaded);
                setState({ ...state, loading: false });

                if (values.file && values.cover?._id) {
                  // deleteMutate(values.cover._id); // Commented out as deleteMutate is not defined
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

                  {/* Country Field */}
                  <Box sx={{ width: '100%' }} mt={3}>
                    <div>
                      <LabelStyle component="label" htmlFor="country">
                        Country
                      </LabelStyle>
                      <TextField
                        select
                        id="country"
                        label="Select Country"
                        fullWidth
                        {...getFieldProps('country')}
                        error={Boolean(touched.country && errors.country)}
                        helperText={touched.country && errors.country}
                      >
                        {countries.map((country) => (
                          <MenuItem key={country.code} value={country.code}>
                            {country.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </Box>

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
                        Logo (optional)
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
                        Cover Image (optional)
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
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isCreatingShop}
                    sx={{ ml: 'auto', mt: 3 }}
                  >
                    Create Photographer Account
                  </LoadingButton>

                  <Typography variant="subtitle2" mt={3} textAlign="center">
                    Already have an account? &nbsp;
                    <Link href="/auth/login" color="primary" fontWeight={600}>
                      Login
                    </Link>
                  </Typography>
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
    </>
  );
}