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
  InputAdornment
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
  isVendor
}) {
  const router = useRouter();
  const [loading, setloading] = React.useState(false);
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
        toast.error(error.response.data.message);
      }
    }
  );

   const [state, setstate] = useState({
      loading: false,
      name: '',
      search: '',
      open: false
    });
    
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Car Registration is required'),
    category: Yup.string().required('Vehicle make is required'),
    shop: isVendor ? Yup.string().nullable().notRequired() : Yup.string().required('Photographer is required'),
    subCategory: Yup.string().required('Vehicle model is required'),
    brand: Yup.string().required('Location is required'),
    images: Yup.array().min(1, 'Images is required'),
    // price: Yup.number().required('Price is required'),
    priceSale: Yup.number().required('Sale price is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentProduct?.name || '',
      slug: currentProduct?.slug || '',
      brand: currentProduct?.brand || brands[0]?._id || '',
      category: currentProduct?.category || (categories.length && categories[0]?._id) || '',
      shop: isVendor ? null : currentProduct?.shop || (shops?.length && shops[0]?._id) || '',
      subCategory: currentProduct?.subCategory || (categories.length && categories[0].subCategories[0]?._id) || '',
      isFeatured: currentProduct?.isFeatured || false,
      priceSale: currentProduct?.priceSale || '',
      images: currentProduct?.images || []
    },

    validationSchema: NewProductSchema,
    onSubmit: async (values) => {
      const { ...rest } = values;
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
      toast.error(error.response.data.message);
    }
  });
  // handle drop
  // const handleDrop = (acceptedFiles) => {
  //   setloading(true);
  //   const uploaders = acceptedFiles.map((file) => {
  //     const formData = new FormData();
  //     formData.append('file', file);
  //     formData.append('upload_preset', 'my-uploads');
  //     setFieldValue('blob', values.blob.concat(acceptedFiles));
  //     return axios.post(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
  //   });

  //   axios.all(uploaders).then((data) => {
  //     const newImages = data.map(({ data }) => ({
  //       url: data.secure_url,
  //       _id: data.public_id
  //       // blob: blobs[i],
  //     }));
  //     setloading(false);
  //     setFieldValue('images', values.images.concat(newImages));
  //   });
  // };
  // handleAddVariants

  // const handleDrop = async (acceptedFiles) => {
  //   setstate({ ...state, loading: 2 });

  //   const filesWithPreview = acceptedFiles.map((file) => {
  //     Object.assign(file, {
  //       preview: URL.createObjectURL(file),
  //     });
  //     return file;
  //   });

  //   //setFieldValue('blob', values.blob.concat(filesWithPreview));
  //   setFieldValue('blob', (values.blob || []).concat(filesWithPreview));


  //   try {
  //     const uploads = await Promise.all(
  //       filesWithPreview.map((file) =>
  //         uploadToSpaces(file, (progress) => {
  //           setstate((prev) => ({ ...prev, loading: progress }));
  //         })
  //       )
  //     );

  //     setFieldValue('images', values.images.concat(uploads));
  //     setstate({ ...state, loading: false });
  //   } catch (err) {
  //     console.error('Upload failed:', err);
  //     setstate({ ...state, loading: false });
  //   }
  // };

  const addWatermark = (imageFile, watermarkText) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Resize image to a max width of 800px
        const maxWidth = 800;
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        // Draw resized image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Watermark style
        const fontSize = 40;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Rotate canvas diagonally (↗️ direction)
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.atan(canvas.height / canvas.width)); // Diagonal rotation

        // Calculate spacing
        const horizontalSpacing = 350; // Increased to avoid overlap
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


  const [orignalImage,  setorignalImageValue] = useState();

  const handleDrop = async (acceptedFiles) => {
    setstate({ ...state, loading: 2 });

    const filesWithPreview = acceptedFiles.map((file) => {
      Object.assign(file, { preview: URL.createObjectURL(file) });
      return file;
    });

    setFieldValue('blob', (values.blob || []).concat(filesWithPreview));

    try {
      const uploads = await Promise.all(
        filesWithPreview.map(async (file) => {
          // 1. Create watermarked version
          setstate((prev) => ({ ...prev, loading: 2 }))
          const watermarked = await addWatermark(file, 'RaceTrackRegistry');

          // 2. Upload original
          const originalUrl = await uploadToSpaces(file, (progress) =>
            setstate((prev) => ({ ...prev, loading: progress }))
          );

          // 3. Upload watermarked version
          const watermarkedUrl = await uploadToSpaces(watermarked, (progress) =>
            setstate((prev) => ({ ...prev, loading: progress }))
          );

          return {
            original: originalUrl,
            watermarked: watermarkedUrl,
          };
        })
      );
      console.log('uploads', uploads)

      // Save to form field
      if(uploads) {
        const watermarkedImageArray = uploads?.map(fileObj => fileObj?.watermarked)
        const originalImageArray = uploads?.map(fileObj => fileObj?.original)
        setFieldValue('images', values.images.concat(watermarkedImageArray));
        setorignalImageValue(originalImageArray);

      }

      setstate({ ...state, loading: false });
    } catch (err) {
      console.error('Upload failed:', err);
      setstate({ ...state, loading: false });
    }
  };



  // handleRemoveAll
  const handleRemoveAll = () => {
    values.images.forEach((image) => {
      deleteMutate(image._id);
    });
    setFieldValue('images', []);
  };
  // handleRemove
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
      .replace(/\s+/g, '-'); // convert to lowercase, remove special characters, and replace spaces with hyphens
    formik.setFieldValue('slug', slug); // set the value of slug in the formik state
    formik.handleChange(event); // handle the change in formik
  };
  return (
    <Stack spacing={3}>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <div>
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
                          onChange={handleTitleChange} // add onChange handler for title
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      )}
                    </div>
                    <div>
                      <Grid container spacing={2}>
                        {isVendor ? null : (
                          <Grid item xs={12} md={6}>
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

                        <Grid item xs={12} md={6}>
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

                                  // </optgroup>
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
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="grouped-native-select-subCategory">
                                {'Vehicle Model'}
                              </LabelStyle>
                            )}
                            {!categoryLoading ? (
                              <Select
                                native
                                {...getFieldProps('subCategory')}
                                value={values.subCategory}
                                id="grouped-native-select-subCategory"
                              >
                                {categories
                                  .find((v) => v._id.toString() === values.category)
                                  ?.subCategories?.map((subCategory) => (
                                    <option key={subCategory._id} value={subCategory._id}>
                                      {subCategory.name}
                                    </option>

                                    // </optgroup>
                                  ))}
                              </Select>
                            ) : (
                              <Skeleton variant="rectangular" width={'100%'} height={56} />
                            )}
                            {touched.subCategory && errors.subCategory && (
                              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                {touched.subCategory && errors.subCategory}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="brand-name">
                                {'Location'}
                              </LabelStyle>
                            )}

                            <Select native {...getFieldProps('brand')} value={values.brand} id="grouped-native-select">
                              {brands?.map((brand) => (
                                <option key={brand._id} value={brand._id}>
                                  {brand.name}
                                </option>
                              ))}
                            </Select>

                            {touched.brand && errors.brand && (
                              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                {touched.brand && errors.brand}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} md={12}>
                          <div>
                            <LabelStyle component={'label'} htmlFor="product-image">
                              {'Pictures/Videos'} <span>1080 * 1080</span>
                            </LabelStyle>
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
                            />
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
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3} pb={1}>

                  <div>
                    <LabelStyle component={'label'} htmlFor="sale-price">
                      {'Sale Price'}
                    </LabelStyle>
                    <TextField
                      id="sale-price"
                      fullWidth
                      placeholder="0.00"
                      {...getFieldProps('priceSale')}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">{fCurrency(0)?.split('0')[0]}</InputAdornment>,
                        type: 'number'
                      }}
                      error={Boolean(touched.priceSale && errors.priceSale)}
                      helperText={touched.priceSale && errors.priceSale}
                    />
                  </div>
                  <div>
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
                  </div>
                  <Stack spacing={2}>
                    {isInitialized ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <LoadingButton type="submit" variant="contained" size="large" fullWidth loading={updateLoading}>
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
      // ... add other required properties for category
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
    // ... add other optional properties for currentProduct
  }),
  categoryLoading: PropTypes.bool,
  isInitialized: PropTypes.bool,
  isVendor: PropTypes.bool,
  brands: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
      // ... add other required properties for brands
    })
  )
};
