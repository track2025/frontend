'use client';
import React, { useState } from 'react';
import { useRouter } from 'next-nprogress-bar';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// mui
import { styled } from '@mui/material/styles';
import { Card, Stack, Button, TextField, Typography, Box, Select, FormHelperText, Grid, Skeleton } from '@mui/material';

// formik
import { Form, FormikProvider, useFormik } from 'formik';

// api
import * as api from 'src/services';
import UploadSingleFile from 'src/components/upload/UploadSingleFile';
import uploadToSpaces from 'src/utils/upload';
import * as Yup from 'yup';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

PhysicalSubCategoryForm.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
      // ... add other required properties for category
    })
  ).isRequired,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  isInitialized: PropTypes.bool
};

const STATUS_OPTIONS = ['active', 'inactive'];

export default function PhysicalSubCategoryForm({
  data: currentCategory,
  categories,
  isLoading: categoryLoading,
  isInitialized = false
}) {
  const router = useRouter();

  const [state, setstate] = useState({ loading: false, name: '', search: '', open: false });

  const mutationFn = currentCategory ? api.updatePhysicalSubCategoryByAdmin : api.addPhysicalSubCategoryByAdmin;

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn,
    retry: false,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/admin/physical-categories/sub-categories');
    },
    onError: (error) => {
      console.log("error:::", error?.data?.message)
      let arr = error?.data?.message;
      
      if (Array.isArray(arr) && arr.length >= 1) {
        arr.forEach((err) => toast.error(err));
        return;
      } 

      if(typeof error?.data?.message === 'string'){
        toast.error(error?.data?.message || 'Something went wrong!');
        return;
      }
    }
  });
  const { mutateAsync: deleteMutate } = useMutation({
    mutationFn: api.singleDeleteFile,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  });


  const subCategorySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    cover: Yup.mixed().required('Cover is required'),
    slug: Yup.string().required('Slug is required'),
    description: Yup.string().required('Description is required'),
    metaTitle: Yup.string().required('Meta title is required'),
    metaDescription: Yup.string().required('Meta description is required'),
    parentCategory: Yup.string().required('Category is required')
  });


  console.log('====>', currentCategory?.parentCategory)
  // console.log("::::", categories[0]?._id)

  console.log('categories array', categories)

  // let curCar  = categories.findOne(cat => cat._id === currentCategory?.parentCategory);
  // console.log('current category', curCar)
  

  const formik = useFormik({
    initialValues: {
      name: currentCategory?.name || '',
      metaTitle: currentCategory?.metaTitle || '',
      cover: currentCategory?.cover || null,
      description: currentCategory?.description || '',
      metaDescription: currentCategory?.metaDescription || '',

      slug: currentCategory?.slug || '',
      status: currentCategory?.status || STATUS_OPTIONS[0],
      parentCategory: currentCategory?.parentCategory // || (categories && categories[0]?._id) || ''
    },
    enableReinitialize: true,
    validationSchema: subCategorySchema,
    onSubmit: async (values) => {
      const { ...rest } = values;
      try {
        mutate({ ...rest, ...(currentCategory && { currentSlug: currentCategory.slug }) });
      } catch (error) {
        let errorMessage = parseMongooseError(error);
        toast.error(errorMessage || 'Something went wrong!');
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
            <Grid size={{ md: 8, xs: 12 }}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Stack gap={1}>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <Typography variant="overline" color="text.primary" htmlFor="category-name" component={'label'}>
                        Sub Category Name 
                      </Typography>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rounded" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="category-name"
                        fullWidth
                        {...getFieldProps('name')}
                        onChange={handleTitleChange} // add onChange handler for title
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    )}
                  </Stack>
                  <Stack gap={1}>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={100} />
                    ) : (
                      <Typography variant="overline" color="text.primary" htmlFor="metaTitle" component={'label'}>
                        Meta Title
                      </Typography>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rounded" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="meta-title"
                        fullWidth
                        {...getFieldProps('metaTitle')}
                        error={Boolean(touched.metaTitle && errors.metaTitle)}
                        helperText={touched.metaTitle && errors.metaTitle}
                      />
                    )}
                  </Stack>

                  <Stack gap={1}>
                    {isInitialized || categoryLoading ? (
                      <Skeleton variant="text" width={100} />
                    ) : (
                      <Typography
                        variant="overline"
                        color="text.primary"
                        htmlFor="grouped-native-select"
                        component={'label'}
                      >
                        Category
                      </Typography>
                    )}
                    {!categoryLoading ? (
                      <Select
                        native
                        fullWidth
                        {...getFieldProps('parentCategory')}
                        value={values.parentCategory}
                        id="grouped-native-select"
                      >
                        {categories?.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Skeleton variant="rounded" width={'100%'} height={56} />
                    )}
                    {touched.parentCategory && errors.parentCategory && (
                      <FormHelperText error sx={{ px: 2, mx: 0 }}>
                        {touched.parentCategory && errors.parentCategory}
                      </FormHelperText>
                    )}
                  </Stack>
                  <Stack gap={1}>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={70} />
                    ) : (
                      <Typography variant="overline" color="text.primary" htmlFor="slug" component={'label'}>
                        Slug
                      </Typography>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rounded" width="100%" height={56} />
                    ) : (
                      <TextField
                        fullWidth
                        id="slug"
                        {...getFieldProps('slug')}
                        error={Boolean(touched.slug && errors.slug)}
                        helperText={touched.slug && errors.slug}
                      />
                    )}
                  </Stack>
                  <Stack gap={1}>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={100} />
                    ) : (
                      <Typography variant="overline" color="text.primary" htmlFor="description" component={'label'}>
                        Description
                      </Typography>
                    )}

                    {categoryLoading ? (
                      <Skeleton variant="rounded" width="100%" height={240} />
                    ) : (
                      <TextField
                        fullWidth
                        id="description"
                        {...getFieldProps('description')}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description}
                        rows={9}
                        multiline
                      />
                    )}
                  </Stack>
                </Stack>
              </Card>
            </Grid>
            <Grid size={{ md: 4, xs: 12 }}>
              <div style={{ position: '-webkit-sticky', position: 'sticky', top: 0 }}>
                <Stack spacing={3}>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <Stack gap={1}>
                        {categoryLoading ? (
                          <Skeleton variant="text" width={150} />
                        ) : (
                          <Typography
                            variant="overline"
                            color="text.primary"
                            htmlFor="meta-description"
                            component={'label'}
                          >
                            Meta Description
                          </Typography>
                        )}
                        {categoryLoading ? (
                          <Skeleton variant="rounded" width="100%" height={240} />
                        ) : (
                          <TextField
                            id="meta-description"
                            fullWidth
                            {...getFieldProps('metaDescription')}
                            error={Boolean(touched.metaDescription && errors.metaDescription)}
                            helperText={touched.metaDescription && errors.metaDescription}
                            rows={9}
                            multiline
                          />
                        )}
                      </Stack>

                      <div>
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
                            <LabelStyle component={'label'} htmlFor="brand-image">
                              <span></span>
                            </LabelStyle>
                          )}
                        </Stack>

                        {categoryLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={225} />
                        ) : (
                          <UploadSingleFile
                            id="brand-image"
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

                      <Stack gap={1} sx={{ select: { textTransform: 'capitalize' } }}>
                        {categoryLoading ? (
                          <Skeleton variant="text" width={70} />
                        ) : (
                          <Typography variant="overline" color="text.primary" htmlFor="status" component={'label'}>
                            Status
                          </Typography>
                        )}
                        {categoryLoading ? (
                          <Skeleton variant="rounded" width="100%" height={56} />
                        ) : (
                          <Select
                            id="status"
                            native
                            fullWidth
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
                      </Stack>
                    </Stack>
                  </Card>
                  {categoryLoading ? (
                    <Skeleton variant="rounded" width="100%" height={56} />
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      loading={isLoading}
                      sx={{ ml: 'auto', mt: 3 }}
                    >
                      {currentCategory ? 'Update' : 'Create'}
                    </Button>
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
