'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next-nprogress-bar';
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
// formik
import { Form, FormikProvider, useFormik } from 'formik';
import UploadSingleFile from 'src/components/upload/UploadSingleFile';
import uploadToSpaces from 'src/utils/upload';


const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

const STATUS_OPTIONS = ['active', 'deactive'];

export default function PhysicalBrandsForm({ data: currentBrand, isLoading: brandLoading }) {
  const router = useRouter();

  const [state, setstate] = useState({
    loading: false,
    name: '',
    search: '',
    open: false
  });

  const { mutate, isLoading } = useMutation(
    currentBrand ? 'update' : 'new',
    currentBrand ? api.updatePhysicalBrandByAdmin : api.addPhysicalBrandByAdmin,
    {
      ...(currentBrand && {
        enabled: Boolean(currentBrand)
      }),
      retry: false,
      onSuccess: (data) => {
        toast.success(data.message);
        router.push('/admin/locations');
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      }
    }
  );
  const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  });
  const BrandSchema = Yup.object().shape({
    name: Yup.string().required('Brand name is required'),
    logo: Yup.mixed().required('Logo is required'),
    slug: Yup.string().required('Slug is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: currentBrand?.name || '',
      logo: currentBrand?.logo || null,
      description: currentBrand?.description || '',
      slug: currentBrand?.slug || '',
      status: currentBrand?.status || STATUS_OPTIONS[0]
    },
    enableReinitialize: true,
    validationSchema: BrandSchema,
    onSubmit: async (values) => {
      const { ...rest } = values;
      try {
        mutate({
          ...rest,
          ...(currentBrand && {
            currentSlug: currentBrand.slug
          })
        });
      } catch (error) {
        console.error(error);
      }
    }
  });
  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  const handleDrop = async (acceptedFiles) => {
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
            }} >
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <div>
                    {brandLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="brand-name">
                        {' '}
                        {'Brand Name'}{' '}
                      </LabelStyle>
                    )}
                    {brandLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="brand-name"
                        fullWidth
                        {...getFieldProps('name')}
                        onChange={handleTitleChange} // add onChange handler for title
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    )}
                  </div>
              

                  <div>
                    {brandLoading ? (
                      <Skeleton variant="text" width={100} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="brand-description">
                        {' '}
                        {'Brand Description'}{' '}
                      </LabelStyle>
                    )}
                    {brandLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={240} />
                    ) : (
                      <TextField
                        fullWidth
                        id="brand-description"
                        {...getFieldProps('description')}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description}
                        rows={9}
                        multiline
                      />
                    )}
                  </div>
                </Stack>
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
                    <Stack spacing={3}>

                      <div>
                        <Stack direction="row" justifyContent="space-between">
                          {brandLoading ? (
                            <Skeleton variant="text" width={150} />
                          ) : (
                            <LabelStyle variant="body1" component={'label'} color="text.primary">
                              Brand Logo
                            </LabelStyle>
                          )}
                          {brandLoading ? (
                            <Skeleton variant="text" width={150} />
                          ) : (
                            <LabelStyle component={'label'} htmlFor="brand-image">
                              <span></span>
                            </LabelStyle>
                          )}
                        </Stack>

                        {brandLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={225} />
                        ) : (
                          <UploadSingleFile
                            id="brand-image"
                            file={values.logo}
                            onDrop={handleDrop}
                            error={Boolean(touched.logo && errors.logo)}
                            category
                            accept="image/*"
                            loading={state.loading}
                          />
                        )}
                        {touched.logo && errors.logo && (
                          <FormHelperText error sx={{ px: 2, mx: 0 }}>
                            {touched.logo && errors.logo}
                          </FormHelperText>
                        )}
                      </div>
                      <FormControl fullWidth sx={{ select: { textTransform: 'capitalize' } }}>
                        {brandLoading ? (
                          <Skeleton variant="text" width={70} />
                        ) : (
                          <LabelStyle component={'label'} htmlFor="brand-status">
                            {'Status'}
                          </LabelStyle>
                        )}
                        {brandLoading ? (
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
                  {brandLoading ? (
                    <Skeleton variant="rectangular" width="100%" height={56} />
                  ) : (
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      size="large"
                      loading={isLoading}
                      sx={{ ml: 'auto', mt: 3 }}
                    >
                      {currentBrand ? 'Update Physical Brand' : 'Add Physical Brand'}
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

PhysicalBrandsForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};
