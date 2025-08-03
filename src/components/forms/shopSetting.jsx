'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
// mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, TextField, Typography, Box, FormHelperText, Grid, Skeleton, MenuItem } from '@mui/material';
// components
import UploadSingleFile from 'src/components/upload/UploadSingleFile';
// yup
import * as Yup from 'yup';
// axios
import axios from 'axios';
// toast
import toast from 'react-hot-toast';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
// api
import * as api from 'src/services';

import { useQuery } from 'react-query';
import parseMongooseError from 'src/utils/errorHandler'


ShopSettingFrom.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

export default function ShopSettingFrom({ data: currentShop, isLoading: categoryLoading }) {
  const [state, setstate] = useState({
    logoLoading: false,
    loading: false,
    name: '',
    search: '',
    open: false
  }); 

  const { mutate, isLoading } = useMutation(
    currentShop ? 'update' : 'new',
    currentShop ? api.updateShopByVendor : api.addShopByVendor,
    {
      ...(currentShop && {
        enabled: Boolean(currentShop)
      }),
      retry: false,
      onSuccess: (data) => {
        toast.success(currentShop ? data.message : "our photographer profile is currently under review. We’ll notify you once it’s approved.");
        // router.push('/dashboard/categories');
      },
      onError: (error) => {
       // toast.error(error.response.data.message);
         let errorMessage = parseMongooseError(error.response.data.message)
              toast.error(errorMessage, {
                autoClose: false,        // Prevents auto-dismissal
                closeOnClick: true,      // Allows clicking on the close icon
                draggable: true,         // Allows dragging to dismiss
              });
      }
    }
  );
  // const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
  //   onError: (error) => {
  //     toast.error(error.response.data.message);
  //   }
  // });
  const ShopSettingScema = Yup.object().shape({
    username: Yup.string().required('username is required')
        .matches(
          /^[a-zA-Z0-9][a-zA-Z0-9._]{2,29}$/,
          'Username must start with a letter or number and can contain letters, numbers, dots, and underscores. Length must be between 3 and 30 characters.'
        ),
    cover: Yup.mixed().required('Cover is required'),
    logo: Yup.mixed().required('logo is required'),
    slug: Yup.string().required('Slug is required'),
    description: Yup.string().required('Description is required'),
    phone: Yup.string().required('Phone Number is required'),
    defaultPrice: Yup.number().required('Default Price is required'),
    paymentInfo: Yup.object().shape({
      holderName: Yup.string().required('Holder Name is required'),
      holderEmail: Yup.string().required('Holder email is required'),
      bankName: Yup.string().required('Bank name is required'),
      AccountNo: Yup.number().required('Account No is required')
    }),
    address: Yup.object().shape({
      country: Yup.string().required('Country is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      streetAddress: Yup.string().required('Street Address is required')
    })
  });
  console.log(currentShop, 'currentShop');
  const formik = useFormik({
    initialValues: {
      username: currentShop?.username || '',
      defaultCurrency: currentShop?.defaultCurrency || 'AED',
      defaultPrice: currentShop?.defaultPrice || 100,
      cover: currentShop?.cover || null,
      logo: currentShop?.logo || null,
      description: currentShop?.description || '',
      file: currentShop?.cover || '',
      slug: currentShop?.slug || '',
      phone: currentShop?.phone || Number,
      paymentInfo: {
        holderName: currentShop?.paymentInfo?.holderName || '',
        holderEmail: currentShop?.paymentInfo?.holderEmail || '',
        bankName: currentShop?.paymentInfo?.bankName || '',
        AccountNo: currentShop?.paymentInfo?.AccountNo || Number
      },
      address: {
        country: currentShop?.address.country || '',
        city: currentShop?.address.city || '',
        state: currentShop?.address.state || '',
        streetAddress: currentShop?.address.streetAddress || ''
      }
    },
    enableReinitialize: true,
    validationSchema: ShopSettingScema,
    onSubmit: async (values) => {
      const { ...rest } = values;
      // console.log(...rest, 'reset');
      try {
        mutate({
          ...rest,
          ...(currentShop && {
            currentSlug: currentShop.slug
          })
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

    const { data } = useQuery(['get-currencies'], () => api.getCurrencies());
  

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


                <Stack mt={3} direction="row" spacing={3} flexGrow="wrap">
                  <Box sx={{ width: '100%' }}>
                    <Stack direction="row" justifyContent="space-between">
                      {categoryLoading ? (
                        <Skeleton variant="text" width={150} />
                      ) : (
                        <LabelStyle variant="body1" component={'label'} color="text.primary">
                          Logo
                        </LabelStyle>
                      )}
                      {categoryLoading ? (
                        <Skeleton variant="text" width={150} />
                      ) : (
                        <LabelStyle component={'label'} htmlFor="file">
                          <span>512 * 512</span>
                        </LabelStyle>
                      )}
                    </Stack>
                    {categoryLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={225} />
                    ) : (
                      <UploadSingleFile
                        id="file"
                        file={values.logo}
                        onDrop={handleDropLogo}
                        error={Boolean(touched.logo && errors.logo)}
                        category
                        accept="image/*"
                        loading={state.logoLoading}
                      />
                    )}
                    {touched.logo && errors.logo && (
                      <FormHelperText error sx={{ px: 2, mx: 0 }}>
                        {touched.logo && errors.logo}
                      </FormHelperText>
                    )}
                  </Box>
                </Stack>
                
                <Box mt={3}>
                  <Stack direction="row" justifyContent="space-between">
                    {categoryLoading ? (
                      <Skeleton variant="text" width={150} />
                    ) : (
                      <LabelStyle variant="body1" component={'label'} color="text.primary">
                        Cover
                      </LabelStyle>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="text" width={150} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="file">
                        <span>990 * 300</span>
                      </LabelStyle>
                    )}
                  </Stack>
                  {categoryLoading ? (
                    <Skeleton variant="rectangular" width="100%" height={225} />
                  ) : (
                    <UploadSingleFile
                      id="file"
                      file={values.cover}
                      onDrop={handleDropCover}
                      error={Boolean(touched.cover && errors.cover)}
                      category
                      accept="image/*"
                      loading={state.loading}
                    />
                  )}
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
                      
                      
                      <div>
                        {categoryLoading ? (
                          <Skeleton variant="text" width={150} />
                        ) : (
                          <LabelStyle component={'label'} htmlFor="bank-name">
                            Bank Name
                          </LabelStyle>
                        )}
                        {categoryLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={240} />
                        ) : (
                          <TextField
                            id="bank-name"
                            fullWidth
                            {...getFieldProps('paymentInfo.bankName')}
                            error={Boolean(touched.paymentInfo?.bankName && errors.paymentInfo?.bankName)}
                            helperText={touched.paymentInfo?.bankName && errors.paymentInfo?.bankName}
                          />
                        )}
                      </div>
                      <div>
                        {categoryLoading ? (
                          <Skeleton variant="text" width={150} />
                        ) : (
                          <LabelStyle component={'label'} htmlFor="account-number">
                            Account Number
                          </LabelStyle>
                        )}
                        {categoryLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={240} />
                        ) : (
                          <TextField
                            id="account-number"
                            fullWidth
                            {...getFieldProps('paymentInfo.AccountNo')}
                            error={Boolean(touched.paymentInfo?.AccountNo && errors.paymentInfo?.AccountNo)}
                            helperText={touched.paymentInfo?.AccountNo && errors.paymentInfo?.AccountNo}
                          />
                        )}
                      </div>
                      <div>
                        {categoryLoading ? (
                          <Skeleton variant="text" width={150} />
                        ) : (
                          <LabelStyle component={'label'} htmlFor="phone">
                            Phone Number
                          </LabelStyle>
                        )}
                        {categoryLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={240} />
                        ) : (
                          <TextField
                            id="phone"
                            fullWidth
                            {...getFieldProps('phone')}
                            error={Boolean(touched.phone && errors.phone)}
                            helperText={touched.phone && errors.phone}
                          />
                        )}
                      </div>
                      <div>
                        {categoryLoading ? (
                          <Skeleton variant="text" width={150} />
                        ) : (
                          <LabelStyle component={'label'} htmlFor="country">
                            Country
                          </LabelStyle>
                        )}
                        {categoryLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={240} />
                        ) : (
                          <TextField
                            id="country"
                            fullWidth
                            {...getFieldProps('address.country')}
                            error={Boolean(touched.address?.country && errors.address?.country)}
                            helperText={touched.address?.country && errors.address?.country}
                          />
                        )}
                      </div>
                      <div>
                        {categoryLoading ? (
                          <Skeleton variant="text" width={150} />
                        ) : (
                          <LabelStyle component={'label'} htmlFor="city">
                            City
                          </LabelStyle>
                        )}
                        {categoryLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={240} />
                        ) : (
                          <TextField
                            id="city"
                            fullWidth
                            {...getFieldProps('address.city')}
                            error={Boolean(touched.address?.city && errors.address?.city)}
                            helperText={touched.address?.city && errors.address?.city}
                          />
                        )}
                      </div>
                      <div>
                        {categoryLoading ? (
                          <Skeleton variant="text" width={150} />
                        ) : (
                          <LabelStyle component={'label'} htmlFor="state">
                            State
                          </LabelStyle>
                        )}
                        {categoryLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={240} />
                        ) : (
                          <TextField
                            id="state"
                            fullWidth
                            {...getFieldProps('address.state')}
                            error={Boolean(touched.address?.state && errors.address?.state)}
                            helperText={touched.address?.state && errors.address?.state}
                          />
                        )}
                      </div>
                      <div>
                        {categoryLoading ? (
                          <Skeleton variant="text" width={150} />
                        ) : (
                          <LabelStyle component={'label'} htmlFor="streetAddress">
                            Street Address
                          </LabelStyle>
                        )}
                        {categoryLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={240} />
                        ) : (
                          <TextField
                            id="streetAddress"
                            fullWidth
                            {...getFieldProps('address.streetAddress')}
                            error={Boolean(touched.address?.streetAddress && errors.address?.streetAddress)}
                            helperText={touched.address?.streetAddress && errors.address?.streetAddress}
                          />
                        )}
                      </div>

                      {/* <FormControl fullWidth sx={{ select: { textTransform: 'capitalize' } }}>
                        {categoryLoading ? (
                          <Skeleton variant="text" width={70} />
                        ) : (
                          <LabelStyle component={'label'} htmlFor="status">
                            {'Status'}
                          </LabelStyle>
                        )}
                        {categoryLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={56} />
                        ) : (
                          <Select
                            id="status"
                            native
                            {...getFieldProps('status')}
                            error={Boolean(touched.status && errors.status)}
                          >
                            <option value="" style={{ display: 'none' }} />
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
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
                      </FormControl> */}
                    </Stack>
                  </Card>
                  {categoryLoading ? (
                    <Skeleton variant="rectangular" width="100%" height={56} />
                  ) : (
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      size="large"
                      loading={isLoading}
                      sx={{ ml: 'auto', mt: 3 }}
                    >
                      {currentShop ? 'Edit Shop' : 'Save'}
                    </LoadingButton>
                  )}
                </Stack>
              </div>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
