'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next-nprogress-bar';

// mui
import { styled } from '@mui/material/styles';
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
import { LoadingButton } from '@mui/lab';

// api
import * as api from 'src/services';
// yup
import * as Yup from 'yup';
// utils
import uploadToSpaces from 'src/utils/upload';
// components
import UploadSingleFile from 'src/components/upload/UploadSingleFile';
// formik
import { Form, FormikProvider, useFormik } from 'formik';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

const STATUS_OPTIONS = ['active', 'inactive'];

export default function ChildCategoryForm({ data: currentCategory, categories, isLoading: categoryLoading }) {
  const router = useRouter();

  const [state, setstate] = useState({
    loading: false,
    name: '',
    search: '',
    open: false
  });

  const { mutate, isLoading } = useMutation(
    currentCategory ? 'update' : 'new',
    currentCategory ? api.updatePhysicalChildCategoryByAdmin : api.addPhysicalChildCategoryByAdmin,
    {
      ...(currentCategory && { enabled: Boolean(currentCategory) }),
      retry: false,
      onSuccess: (data) => {
        toast.success(data.message);
        router.push('/admin/categories/child-categories');
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong!');
      }
    }
  );

  const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  });

  // ✅ Validation Schema (mirroring PhysicalBrandsForm)
  const ChildCategorySchema = Yup.object().shape({
    name: Yup.string().required('Category name is required'),
    slug: Yup.string().required('Slug is required'),
    cover: Yup.mixed().required('Image is required'),
    description: Yup.string().required('Description is required')
  });

  const formik = useFormik({
    initialValues: {
      name: currentCategory?.name || '',
      description: currentCategory?.description || '',
      cover: currentCategory?.cover || null,
      slug: currentCategory?.slug || '',
      status: currentCategory?.status || STATUS_OPTIONS[0],
      parentCategory: currentCategory?.subCategory?.parentCategory?._id || categories?.[0]?._id || '',
      subCategory:
        currentCategory?.subCategory?._id ||
        categories?.[0]?.subCategories?.[0]?._id ||
        ''
    },
    enableReinitialize: true,
    validationSchema: ChildCategorySchema,
    onSubmit: async (values) => {
      const { ...rest } = values;
      try {
        mutate({
          ...rest,
          ...(currentCategory && { currentSlug: currentCategory.slug })
        });
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  // ✅ File Upload (copied logic from PhysicalBrandsForm)
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
      .replace(/\s+/g, '-');
    formik.setFieldValue('slug', slug);
    formik.handleChange(event);
  };

  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* LEFT SIDE */}
            <Grid
              item
              sx={{
                width: {
                  xs: '100%',
                  md: '60%'
                }
              }}
            >
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {/* Category Name */}
                  <div>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="category-name">
                        Child Category Name
                      </LabelStyle>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="category-name"
                        fullWidth
                        {...getFieldProps('name')}
                        onChange={handleTitleChange}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={100} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="category-description">
                        Description
                      </LabelStyle>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={240} />
                    ) : (
                      <TextField
                        fullWidth
                        id="category-description"
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

            {/* RIGHT SIDE */}
            <Grid
              item
              sx={{
                width: {
                  xs: '100%',
                  md: '30%'
                }
              }}
            >
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
                      {/* Image Upload */}
                      <div>
                        <Stack direction="row" justifyContent="space-between">
                          {categoryLoading ? (
                            <Skeleton variant="text" width={150} />
                          ) : (
                            <LabelStyle variant="body1" component={'label'} color="text.primary">
                              Category Image
                            </LabelStyle>
                          )}
                          {categoryLoading ? (
                            <Skeleton variant="text" width={150} />
                          ) : (
                            <LabelStyle component={'label'} htmlFor="category-image">
                              <span></span>
                            </LabelStyle>
                          )}
                        </Stack>

                        {categoryLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={225} />
                        ) : (
                          <UploadSingleFile
                            id="category-image"
                            file={values.cover}
                            onDrop={handleDrop}
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
                      </div>

                      {/* Status */}
                      <FormControl fullWidth sx={{ select: { textTransform: 'capitalize' } }}>
                        {categoryLoading ? (
                          <Skeleton variant="text" width={70} />
                        ) : (
                          <LabelStyle component={'label'} htmlFor="category-status">
                            Status
                          </LabelStyle>
                        )}
                        {categoryLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={56} />
                        ) : (
                          <Select
                            id="category-status"
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

                  {/* Submit Button */}
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
                      {currentCategory ? 'Update Child Category' : 'Add Child Category'}
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

ChildCategoryForm.propTypes = {
  data: PropTypes.object,
  categories: PropTypes.array,
  isLoading: PropTypes.bool
};
