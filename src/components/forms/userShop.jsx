'use client';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { updateUserRole } from 'src/redux/slices/user';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';
// mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, TextField, Typography, Box, FormHelperText, Grid, MenuItem } from '@mui/material';
// components
import UploadSingleFile from 'src/components/upload/UploadSingleFile';
import countries from 'src/components/_main/checkout/countries.json';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import parseMongooseError from 'src/utils/errorHandler'


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

  const { user, isAuthenticated } = useSelector(({ user }) => user);
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect with the current page or fixed redirect path
      router.replace('/auth/register?redirect=/create-shop');
    }
  }, [isAuthenticated, router]);


  

  const { data } = useQuery(['get-currencies'], () => api.getCurrencies());

  const { mutate, isLoading } = useMutation('new-user-shop', api.addShopByUser, {
    retry: false,
    onSuccess: () => {
      toast.success('Your photographer account is now under review.', {
        autoClose: 4000
      });      
      dispatch(updateUserRole());
      router.push('/vendor/dashboard');
    },
    onError: (error) => {
      let errorMessage = parseMongooseError(error.response.data.message)
      toast.error(errorMessage, {
        autoClose: false,        // Prevents auto-dismissal
        closeOnClick: true,      // Allows clicking on the close icon
        draggable: true,         // Allows dragging to dismiss
      });
    }
  });

  const ShopSettingScema = Yup.object().shape({
    username: Yup.string().required('username is required')
    .matches(
      /^[a-zA-Z0-9][a-zA-Z0-9._]{2,29}$/,
      'Username must start with a letter or number and can contain letters, numbers, dots, and underscores. Length must be between 3 and 30 characters.'
    ),
    cover: Yup.mixed().required('Cover is required'),
    logo: Yup.mixed().required('logo is required'),
    slug: Yup.string().required('Slug is required'),
    description: Yup.string().required('Payoff line is required'),
    phone: Yup.string().required('Phone Number is required'),
    defaultPrice: Yup.number().required('Default Price is required'),
    paymentInfo: Yup.object().shape({
      holderName: Yup.string().required('Holder Name is required'),
      holderEmail: Yup.string().required('Holder email is required'),
      // bankName: Yup.string().required('Bank name is required'),
      // AccountNo: Yup.number().required('Account No is required')
    }),
    address: Yup.object().shape({
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      streetAddress: Yup.string().required('Street Address is required')
    })
  });
  const formik = useFormik({
    initialValues: {
      username: '',
      cover: null,
      logo: null,
      description: '',
      file: '',
      slug: '',
      phone: '',
      defaultCurrency: 'AED',
      defaultPrice:100,
      paymentInfo: {
        holderName: user?.firstName + ' ' + user?.lastName,
        holderEmail: user?.email,
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
      console.log(values)
      const { file, ...rest } = values;
      try {
        mutate({
          ...rest
        });
      } catch (error) {
        console.error(error);
      }
    }
  });
  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;
  // handle drop logo
  // const handleDropLogo = async (acceptedFiles) => {
  //   setstate({ ...state, loading: 2 });
  //   const file = acceptedFiles[0];
  //   if (file) {
  //     Object.assign(file, {
  //       preview: URL.createObjectURL(file)
  //     });
  //   }
  //   setFieldValue('file', file);
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('upload_preset', 'my-uploads');
  //   const config = {
  //     onUploadProgress: (progressEvent) => {
  //       const { loaded, total } = progressEvent;
  //       const percentage = Math.floor((loaded * 100) / total);
  //       setstate({ ...state, logoLoading: percentage });
  //     }
  //   };
  //   await axios
  //     .post(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, formData, config)
  //     .then(({ data }) => {
  //       setFieldValue('logo', {
  //         _id: data.public_id,
  //         url: data.secure_url
  //       });
  //       setstate({ ...state, loading: false });
  //     })
  //     .then(() => {
  //       // if (values.file) {
  //       //   deleteMutate(values.logo._id);
  //       // }
  //       setstate({ ...state, loading: false });
  //     });
  // };


   const handleDropLogo = async (acceptedFiles) => {
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
  
        setFieldValue('logo', uploaded);
  
        if (values.file && values.logo?._id) {
          deleteMutate(values.logo._id);
        }
  
        setstate({ ...state, loading: false });
      } catch (err) {
        console.error('Upload failed:', err);
        setstate({ ...state, loading: false });
      }
    };


  // handle drop cover
  // const handleDropCover = async (acceptedFiles) => {
  //   setstate({ ...state, loading: 2 });
  //   const file = acceptedFiles[0];
  //   if (file) {
  //     Object.assign(file, {
  //       preview: URL.createObjectURL(file)
  //     });
  //   }
  //   setFieldValue('file', file);
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('upload_preset', 'my-uploads');
  //   const config = {
  //     onUploadProgress: (progressEvent) => {
  //       const { loaded, total } = progressEvent;
  //       const percentage = Math.floor((loaded * 100) / total);
  //       setstate({ ...state, loading: percentage });
  //     }
  //   };
  //   await axios
  //     .post(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, formData, config)
  //     .then(({ data }) => {
  //       setFieldValue('cover', {
  //         _id: data.public_id,
  //         url: data.secure_url
  //       });
  //       setstate({ ...state, loading: false });
  //     })
  //     .then(() => {
  //       // if (values.file) {
  //       //   deleteMutate(values.cover._id);
  //       // }
  //       setstate({ ...state, loading: false });
  //     });
  // };

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
        Complete your photographer profile
      </Typography>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
                        <Grid item sx={{
              width: {
                xs: '100%', // mobile
                md: '60%'   // desktop
              }
            }}>
              <Card sx={{ p: 3 }}>
                <Stack direction="row" spacing={3} flexGrow="wrap">
                 
                  <Box sx={{ width: '100%' }}>
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
                        sx={{ mt: 1 }}
                      />
                    </div>
                  </Box>
                </Stack>
                <Stack mt={3} spacing={3} direction="row" flexGrow="wrap">
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

                </Stack>

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
      {(data?.data)?.map((cur, index) => (
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
                        <span>512 * 512</span>
                      </LabelStyle>
                    </Stack>

                    <UploadSingleFile
                      id="file"
                      file={values.logo}
                      onDrop={handleDropLogo}
                      error={Boolean(touched.logo && errors.logo)}
                      category
                      accept="image/*"
                      loading={state.logoLoading}
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
                      <span>990 * 300</span>
                    </LabelStyle>
                  </Stack>

                  <UploadSingleFile
                    id="file"
                    file={values.cover}
                    onDrop={handleDropCover}
                    error={Boolean(touched.cover && errors.cover)}
                    category
                    accept="image/*"
                    loading={state.loading}
                  />

                  {touched.cover && errors.cover && (
                    <FormHelperText error sx={{ px: 2, mx: 0 }}>
                      {touched.cover && errors.cover}
                    </FormHelperText>
                  )}
                </Box>{' '}
              </Card>
            </Grid>

            <Grid item sx={{
              width: {
                xs: '100%', // mobile
                md: '30%'   // desktop
              }
            }}>
              <div
                style={{
                  position: '-webkit-sticky',
                  position: 'sticky',
                  top: 0
                }}
              >
                <Stack spacing={3}>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      {/* <div>
                        <LabelStyle component={'label'} htmlFor="holder-name">
                          Full Name
                        </LabelStyle>

                        <TextField
                          id="holder-name"
                          fullWidth
                          {...getFieldProps('paymentInfo.holderName')}
                          error={Boolean(touched.paymentInfo?.holderName && errors.paymentInfo?.holderName)}
                          helperText={touched.paymentInfo?.holderName && errors.paymentInfo?.holderName}
                        />
                      </div>
                      <div>
                        <LabelStyle component={'label'} htmlFor="holder-email">
                          Email
                        </LabelStyle>

                        <TextField
                          id="holder-email"
                          fullWidth
                          {...getFieldProps('paymentInfo.holderEmail')}
                          error={Boolean(touched.paymentInfo?.holderEmail && errors.paymentInfo?.holderEmail)}
                          helperText={touched.paymentInfo?.holderEmail && errors.paymentInfo?.holderEmail}
                        />
                      </div> */}
                      {/* <div>
                        <LabelStyle component={'label'} htmlFor="bank-name">
                          Bank Name
                        </LabelStyle>

                        <TextField
                          id="bank-name"
                          fullWidth
                          {...getFieldProps('paymentInfo.bankName')}
                          error={Boolean(touched.paymentInfo?.bankName && errors.paymentInfo?.bankName)}
                          helperText={touched.paymentInfo?.bankName && errors.paymentInfo?.bankName}
                        />
                      </div>
                      <div>
                        <LabelStyle component={'label'} htmlFor="account-number">
                          Account Number
                        </LabelStyle>

                        <TextField
                          id="account-number"
                          fullWidth
                          {...getFieldProps('paymentInfo.AccountNo')}
                          error={Boolean(touched.paymentInfo?.AccountNo && errors.paymentInfo?.AccountNo)}
                          helperText={touched.paymentInfo?.AccountNo && errors.paymentInfo?.AccountNo}
                        />
                      </div> */}
                      <div>
                        <LabelStyle component={'label'} htmlFor="phone">
                          Phone Number
                        </LabelStyle>

                        <TextField
                          id="phone"
                          fullWidth
                          {...getFieldProps('phone')}
                          error={Boolean(touched.phone && errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      </div>
                      <div>
                        <LabelStyle component={'label'} htmlFor="country">
                          Country
                        </LabelStyle>

                        <TextField
                          id="country"
                          select
                          fullWidth
                          placeholder="Country"
                          {...getFieldProps('address.country')}
                          SelectProps={{ native: true }}
                          error={Boolean(touched?.address?.country && errors?.address?.country)}
                          helperText={touched?.address?.country && errors?.address?.country}
                        >
                          {countries.map((option) => (
                            <option key={option.code} value={option.label}>
                              {option.label}
                            </option>
                          ))}
                        </TextField>
                      </div>
                      <div>
                        <LabelStyle component={'label'} htmlFor="city">
                          City
                        </LabelStyle>

                        <TextField
                          id="city"
                          fullWidth
                          {...getFieldProps('address.city')}
                          error={Boolean(touched.address?.city && errors.address?.city)}
                          helperText={touched.address?.city && errors.address?.city}
                        />
                      </div>
                      <div>
                        <LabelStyle component={'label'} htmlFor="state">
                          State
                        </LabelStyle>

                        <TextField
                          id="state"
                          fullWidth
                          {...getFieldProps('address.state')}
                          error={Boolean(touched.address?.state && errors.address?.state)}
                          helperText={touched.address?.state && errors.address?.state}
                        />
                      </div>
                      <div>
                        <LabelStyle component={'label'} htmlFor="streetAddress">
                          Street Address
                        </LabelStyle>

                        <TextField
                          id="streetAddress"
                          fullWidth
                          {...getFieldProps('address.streetAddress')}
                          error={Boolean(touched.address?.streetAddress && errors.address?.streetAddress)}
                          helperText={touched.address?.streetAddress && errors.address?.streetAddress}
                        />
                      </div>
                    </Stack>
                  </Card>

                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isLoading}
                    sx={{ ml: 'auto', mt: 3 }}
                  >
                    Save
                  </LoadingButton>
                </Stack>
              </div>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
