'use client';
import * as Yup from 'yup';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { capitalCase } from 'change-case';
import { useRouter } from 'next-nprogress-bar';

import { Form, FormikProvider, useFormik } from 'formik';
// mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  Select,
  TextField,
  Typography,
  FormControl,
  Autocomplete,
  FormHelperText,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Switch,
  InputAdornment, 
  MenuItem, 
  Box, 
  CircularProgress, 
  Backdrop
} from '@mui/material';
// api
import * as api from 'src/services';
import { useMutation } from 'react-query';
import axios from 'axios';

// components
import UploadMultiFile from 'src/components/upload/UploadMultiFile';
import { fCurrency } from 'src/utils/formatNumber';
import uploadToSpaces from 'src/utils/upload';
import imageCompression from 'browser-image-compression';
import { useQuery } from 'react-query';
import parseMongooseError from 'src/utils/errorHandler';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  lineHeight: 2.5
}));

// ----------------------------------------------------------------------

export default function ProductForm({
  categories,
  currentProduct,
  categoryLoading = false,
  isInitialized = false,
  brands,
  shops,
  isVendor,
  pricing
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate, isLoading: updateLoading } = useMutation(
    currentProduct ? 'update' : 'new',
    currentProduct
      ? isVendor
        ? api.updateVendorProduct
        : api.updateProductByAdmin
      : isVendor
        ? api.createVendorProduct
        : api.createProductByAdmin,
    {
      onSuccess: (data) => {
        toast.success(data.message);
        router.push((isVendor ? '/vendor' : '/admin') + '/products');
      },
      onError: (error) => {
        const status = error?.response?.status;
        if (status === 401) {
          toast.error('Session expired. Please log in again.');
          deleteCookies('token');
          dispatch(setLogout());
          router.push('/auth/login');
        } else {
          toast.error(error?.response?.data?.message || 'An error occurred');
        }
      }
    }
  );

  const [state, setState] = useState({
    loading: false,
    name: '',
    search: '',
    open: false
  });
    
  const NewProductSchema = Yup.object().shape({
    shop: isVendor ? Yup.string().nullable().notRequired() : Yup.string().required('Photographer is required'),
    brand: Yup.string().required('Location is required'),
    images: Yup.array().min(1, 'Images is required'),
    priceSale: Yup.number().required('Sale price is required'),
    currency: Yup.string().required('Currency is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentProduct?.name || '',
      slug: currentProduct?.slug || '',
      brand: currentProduct?.location || currentProduct?.brand || brands[0]?._id || '',
      category: currentProduct?.category || (categories.length && categories[0]?._id) || '',
      shop: isVendor ? null : currentProduct?.shop || (shops?.length && shops[0]?._id) || '',
      subCategory: currentProduct?.subCategory || (categories.length && categories[0].subCategories[0]?._id) || '',
      isFeatured: currentProduct?.isFeatured || false,
      priceSale: currentProduct?.priceSale || pricing?.defaultPrice || '',
      currency: currentProduct?.currency || pricing?.defaultCurrency || '',
      images: currentProduct?.images || [],
      dateCaptured: (currentProduct?.dateCaptured && new Date(currentProduct?.dateCaptured).toISOString().split('T')[0]) || new Date().toISOString().split('T')[0],
      Multiple: currentProduct?.Multiple || false

    },
    validationSchema: NewProductSchema,
    onSubmit: async (values) => {
      const isPresetLocation = /^[a-f\d]{24}$/i.test(values?.brand);
      let cleanedValues = { ...values }
      if(!isPresetLocation) cleanedValues = {...cleanedValues, location: values?.brand, brand: null} 
      console.log("cleanedValues", values?.subCategory)

      
      const getNameById = (array, id) => array?.find(item => item._id?.toString() === id?.toString())?.name || null;
      const selectedCategoryName = getNameById(categories, values?.category);
      const selectedBrandName = getNameById(brands, values?.brand);
      const allSubCategories = categories.flatMap(category => category.subCategories || []);
      const selectedSubCategoryName = getNameById(allSubCategories, values?.subCategory);
      const selectedShopName = getNameById(shops, values?.shop);

      if(selectedBrandName) cleanedValues = {...cleanedValues, location: selectedBrandName} 
      if(selectedCategoryName) cleanedValues = {...cleanedValues, vehicle_make: selectedCategoryName} 
      if(selectedSubCategoryName) cleanedValues = {...cleanedValues, vehicle_model: selectedSubCategoryName} 
      if(!selectedSubCategoryName) cleanedValues = {...cleanedValues, vehicle_model: values?.subCategory, subCategory: null } 

      if (values?.Multiple) cleanedValues = {
          ...cleanedValues,
          category: null,
          name: null,
          subCategory: null,
          vehicle_make:null,
          vehicle_model: null,
          slug: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
      };
      
      const { ...rest } = cleanedValues;
      try {
        mutate({
          ...rest,
          ...(currentProduct && { currentSlug: currentProduct.slug }),
          orignalImage: orignalImage
        });
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;
  const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
    onError: (error) => {
      let errorMessage = parseMongooseError(error.response.data.message)
      toast.error(errorMessage, {
        autoClose: false,
        closeOnClick: true,
        draggable: true,
      });
    }
  });

  const addWatermark = (imageFile, watermarkText) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Resize image to a max width of 1200px
        const maxWidth = 1200;
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        // Draw resized image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Watermark style
        const fontSize = 100;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Rotate canvas diagonally (↗️ direction)
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.atan(canvas.height / canvas.width));

        // Calculate spacing
        const horizontalSpacing = 550;
        const verticalSpacing = 150;

        const xStart = -canvas.width;
        const xEnd = canvas.width * 2;
        const yStart = -canvas.height;
        const yEnd = canvas.height * 2;

        for (let x = xStart; x < xEnd; x += horizontalSpacing) {
          for (let y = yStart; y < yEnd; y += verticalSpacing) {
            ctx.fillText(watermarkText, x, y);
          }
        }

        // Reset transformation
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Export as new file
        canvas.toBlob((blob) => {
          const watermarkedFile = new File([blob], `wm_${imageFile.name}`, { type: 'image/jpeg' });
          resolve(watermarkedFile);
        }, 'image/jpeg', 0.8);
      };
    });

  const [orignalImage, setorignalImageValue] = useState();

  const handleDrop = async (acceptedFiles) => {
    if (isUploading) return; // Prevent new uploads if one is already in progress
    
    setIsUploading(true);
    setLoading(true);
    setUploadProgress(0);

    const filesWithPreview = acceptedFiles.map((file) => {
      Object.assign(file, { preview: URL.createObjectURL(file) });
      return file;
    });

    setFieldValue('blob', (values.blob || []).concat(filesWithPreview));

    try {
      const uploads = await Promise.all(
        filesWithPreview.map(async (file) => {
          // 1. Create watermarked version
          const watermarked = await addWatermark(file, 'Lap Snaps');

          // 2. Upload original
          const originalUrl = await uploadToSpaces(file, (progress) => {
            setUploadProgress(progress);
          });

          // 3. Upload watermarked version
          const watermarkedUrl = await uploadToSpaces(watermarked, (progress) => {
            setUploadProgress(progress);
          });

          return {
            original: originalUrl,
            watermarked: watermarkedUrl,
          };
        })
      );

      if(uploads) {
        const watermarkedImageArray = uploads?.map(fileObj => fileObj?.watermarked);
        const originalImageArray = uploads?.map(fileObj => fileObj?.original);
        setFieldValue('images', values.images.concat(watermarkedImageArray));
        setorignalImageValue(originalImageArray);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveAll = () => {
    values.images.forEach((image) => {
      deleteMutate(image._id);
    });
    values.blob.forEach((b) => {
      deleteMutate(b);
    });
    setFieldValue('images', []);
    setFieldValue('blob', []);
  };

  const handleRemove = (file) => {
    const removeImage = values.images.filter((_file) => {
      if (_file._id === file._id) {
        deleteMutate(file._id);
      }
      return _file !== file;
    });
    setFieldValue('images', removeImage);
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

  const { data } = useQuery(['get-currencies'], () => api.getCurrencies());
  
  return (
    <Stack spacing={3}>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item sx={{
              width: {
                xs: '100%',
                md: '65%'
              }
            }}>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <div>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(e) => setFieldValue('Multiple', e.target.checked)}
                            checked={values.Multiple}
                          />
                        }
                        label={'Check this if uploading pictures of multiple vehicles makes/model'}
                      />
                    </FormGroup>
                  </div>
                  <Stack spacing={3}>
                    {!values.Multiple && <div>
                      {isInitialized ? (
                        <Skeleton variant="text" width={140} />
                      ) : (
                        <LabelStyle component={'label'} htmlFor="product-name">
                          {'Car Registration'}
                        </LabelStyle>
                      )}
                      {isInitialized ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="product-name"
                          fullWidth
                          {...getFieldProps('name')}
                          onChange={handleTitleChange}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      )}
                    </div>}
                    <div>
                      <Grid container spacing={2}>
                        {isVendor ? null : (
                          <Grid item sx={{
                            width: {
                              xs: '100%',
                              md: '100%'
                            }
                          }}>
                            <FormControl fullWidth>
                              {isInitialized ? (
                                <Skeleton variant="text" width={100} />
                              ) : (
                                <LabelStyle component={'label'} htmlFor="shop-select">
                                  {'Photographer'}
                                </LabelStyle>
                              )}

                              <Select native {...getFieldProps('shop')} value={values.shop} id="shop-select">
                                {shops?.map((shop) => (
                                  <option key={shop._id} value={shop._id}>
                                    {shop.title}
                                  </option>
                                ))}
                              </Select>

                              {touched.shop && errors.shop && (
                                <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                  {touched.shop && errors.shop}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                        )}

                        {!values.Multiple && <Grid item sx={{
                          width: {
                            xs: '100%',
                            md: '100%'
                          }
                        }}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="grouped-native-select">
                                {'Vehicle Make'}
                              </LabelStyle>
                            )}
                            {!categoryLoading ? (
                              <Select
                                native
                                {...getFieldProps('category')}
                                value={values.category}
                                id="grouped-native-select"
                              >
                                {categories?.map((category) => (
                                  <option key={category._id} value={category._id}>
                                    {category.name}
                                  </option>
                                ))}
                              </Select>
                            ) : (
                              <Skeleton variant="rectangular" width={'100%'} height={56} />
                            )}
                            {touched.category && errors.category && (
                              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                {touched.category && errors.category}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>}
                        {!values.Multiple && <Grid item sx={{
                          width: {
                            xs: '100%',
                            md: '100%'
                          }
                        }}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="grouped-native-select-subCategory">
                                {'Vehicle Model'}
                              </LabelStyle>
                            )}
                            {!categoryLoading ? (
                              <Autocomplete
                                freeSolo
                                  onChange={(event, newValue) => {
                                  if (typeof newValue === 'string') {
                                    // Handle free text input
                                    setFieldValue('subCategory', newValue);
                                  } else if (newValue && newValue.id) {
                                    // Handle selection from dropdown
                                    setFieldValue('subCategory', newValue.id);
                                  } else {
                                    // Handle clear/empty case
                                    setFieldValue('subCategory', '');
                                  }
                                }}
                                  onInputChange={(event, newInputValue) => {
                                  if (typeof newInputValue === 'string') {
                                    // Handle free text input
                                    setFieldValue('subCategory', newInputValue);
                                  } else if (newInputValue && newInputValue.id) {
                                    // Handle selection from dropdown
                                    setFieldValue('subCategory', newInputValue.id);
                                  } else {

                                    setFieldValue('subCategory', '');
                                  }
                                }}
                                id="subCategory-select"
                                options={
                                  categories
                                    .find((v) => v._id.toString() === values.category)
                                    ?.subCategories?.map((subCategory) => ({
                                      id: subCategory._id,
                                      label: subCategory.name,
                                    })) || []
                                }
                                value={
                                  values.subCategory
                                    ? {
                                        id: values.subCategory,
                                        label:
                                          categories
                                            .find((v) => v._id.toString() === values.category)
                                            ?.subCategories?.find((s) => s._id === values.subCategory)?.name || 
                                          values.subCategory,
                                      }
                                    : null
                                }

                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    error={touched.subCategory && Boolean(errors.subCategory)}
                                    helperText={touched.subCategory && errors.subCategory}
                                  />
                                )}
                              />

                            ) : (
                              <Skeleton variant="rectangular" width={'100%'} height={56} />
                            )}
                            {touched.subCategory && errors.subCategory && (
                              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                {touched.subCategory && errors.subCategory}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>}
                        <Grid item sx={{
                          width: {
                            xs: '100%',
                            md: '100%'
                          }
                        }}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="location">
                                {'Location'}
                              </LabelStyle>
                            )}

                            <Autocomplete
                              freeSolo
                              id="location-select"
                              options={brands?.map((brand) => ({
                                id: brand._id,
                                label: brand.name
                              })) || []}
                              value={values.brand ? { 
                                id: values.brand, 
                                label: brands?.find(b => b._id === values.brand)?.name || values.brand 
                              } : null}
                              onChange={(event, newValue) => {
                                const newValueId = newValue?.id || newValue;
                                setFieldValue('brand', newValueId);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  error={touched.brand && Boolean(errors.brand)}
                                />
                              )}
                            />

                            {touched.brand && errors.brand && (
                              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                {touched.brand && errors.brand}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item sx={{
                          width: {
                            xs: '100%',
                            md: '100%'
                          }
                        }}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="DateTaken">
                                {'Date Captured'}
                              </LabelStyle>
                            )}

                            <TextField
                              type="date"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: {
                                xs: '100%',
                                md: '100%'
                              }}}
                              value={values.dateCaptured}
                              onChange={(e) => {
                                formik.setFieldValue('dateCaptured', e.target.value)
                              }}
                              inputProps={{
                                max: new Date().toISOString().split('T')[0]
                              }}
                            />

                            {touched.dateCaptured && errors.dateCaptured && (
                              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                {touched.dateCaptured && errors.dateCaptured}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item sx={{
                          width: {
                            xs: '100%',
                            md: '100%'
                          }
                        }}>
                          <div>
                            <LabelStyle component={'label'} htmlFor="product-image">
                              {'Pictures/Videos'} <span>1080 * 1080</span>
                            </LabelStyle>
                            <Box sx={{ position: 'relative' }}>
                              {isUploading && (
                                <Backdrop
                                  open={true}
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    zIndex: 10,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    borderRadius: 1,
                                  }}
                                >
                                  <CircularProgress color="inherit" />
                                  <Typography variant="body2" sx={{ mt: 2, color: 'common.white' }}>
                                    Uploading {Math.round(uploadProgress)}%
                                  </Typography>
                                </Backdrop>
                              )}
                              <UploadMultiFile
                                id="product-image"
                                showPreview
                                maxSize={3145728}
                                accept="image/*"
                                files={values?.images}
                                loading={loading}
                                onDrop={handleDrop}
                                onRemove={handleRemove}
                                onRemoveAll={handleRemoveAll}
                                blob={values.blob}
                                error={Boolean(touched.images && errors.images)}
                                isUploading={isUploading}
                              />
                            </Box>
                            {touched.images && errors.images && (
                              <FormHelperText error sx={{ px: 2 }}>
                                {touched.images && errors.images}
                              </FormHelperText>
                            )}
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </Stack>
                </Card>
              </Stack>
            </Grid>
            <Grid item sx={{
              width: {
                xs: '100%',
                md: '30%'
              }
            }}>
              <Card sx={{ p: 3 }}>
                <Stack mt={3} spacing={2} direction="row" spacing={3} flexGrow="wrap">
                  <Box sx={{ width: '100%' }}>
                    <LabelStyle>Price</LabelStyle>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        select
                        label="Currency"
                        fullWidth
                        {...getFieldProps('currency')}
                        error={Boolean(touched.currency && errors.currency)}
                        helperText={touched.currency && errors.currency}
                      >
                        {(data?.data)?.map((cur, index) => (
                          <MenuItem key={index} value={cur.code}>
                            {cur.code}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        id="sale-price"
                        type="number"
                        label={`Price ${values?.currency || ''}`}
                        fullWidth
                        {...getFieldProps('priceSale')}
                        error={Boolean(touched.priceSale && errors.priceSale)}
                        helperText={touched.priceSale && errors.priceSale}
                      />
                    </Stack>
                  </Box>
                </Stack>

                <Stack spacing={3} pb={1}>
                  {!isVendor && <div>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(e) => setFieldValue('isFeatured', e.target.checked)}
                            checked={values.isFeatured}
                          />
                        }
                        label={'Featured'}
                      />
                    </FormGroup>
                  </div>}
                  <Stack spacing={2} pt={3}>
                    {isInitialized ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <LoadingButton 
                        type="submit" 
                        variant="contained" 
                        size="large" 
                        fullWidth 
                        loading={updateLoading}
                        disabled={isUploading} // Disable submit button during upload
                      >
                        {currentProduct ? 'Update Photos' : 'Upload Photos'}
                      </LoadingButton>
                    )}
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Stack>
  );
}

ProductForm.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      subCategories: PropTypes.array.isRequired
    })
  ).isRequired,
  currentProduct: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    code: PropTypes.string,
    slug: PropTypes.string,
    metaTitle: PropTypes.string,
    metaDescription: PropTypes.string,
    brand: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    gender: PropTypes.string,
    category: PropTypes.string,
    subCategory: PropTypes.string,
    status: PropTypes.string,
    blob: PropTypes.array,
    isFeatured: PropTypes.bool,
    sku: PropTypes.string,
    price: PropTypes.number,
    priceSale: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.string),
    sizes: PropTypes.arrayOf(PropTypes.string),
    available: PropTypes.number,
    images: PropTypes.array
  }),
  categoryLoading: PropTypes.bool,
  isInitialized: PropTypes.bool,
  isVendor: PropTypes.bool,
  brands: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  )
};