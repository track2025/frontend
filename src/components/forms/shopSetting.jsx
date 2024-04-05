'use client';
import React, { useState } from 'react';
import { useMutation } from 'react-query';

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
  Skeleton,
  Paper
} from '@mui/material';
// components
import UploadSingleFile from 'src/components/upload/UploadSingleFile';
// next
import { useRouter } from 'next/navigation';
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
import PropTypes from 'prop-types';

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

const STATUS_OPTIONS = ['active', 'deactive'];

export default function ShopSettingFrom({ data: currentCategory, isLoading: categoryLoading }) {
  const router = useRouter();

  const [state, setstate] = useState({
    loading: false,
    name: '',
    search: '',
    open: false
  });

  const { mutate, isLoading } = useMutation(
    currentCategory ? 'update' : 'new',
    currentCategory ? api.updateCategory : api.addCategory,
    {
      ...(currentCategory && {
        enabled: Boolean(currentCategory)
      }),
      retry: false,
      onSuccess: (data) => {
        toast.success(data.message);

        router.push('/dashboard/categories');
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
  const NewCategorySchema = Yup.object().shape({
    title: Yup.string().required('title is required'),
    cover: Yup.mixed().required('Cover is required'),
    logo: Yup.mixed().required('logo is required'),
    slug: Yup.string().required('Slug is required'),
    description: Yup.string().required('Description is required'),
    metaTitle: Yup.string().required('Meta title is required'),
    metaDescription: Yup.string().required('Meta description is required'),
    phone: Yup.string().required('Phone Number is required'),
    holderName: Yup.string().required('Holder Name is required'),
    holderEmail: Yup.string().required('Holder email is required'),
    bankName: Yup.string().required('Bank name is required'),
    AccountNo: Yup.string().required('Account No is required')
  });

  const formik = useFormik({
    initialValues: {
      title: currentCategory?.title || '',
      metaTitle: currentCategory?.metaTitle || '',
      cover: currentCategory?.cover || null,
      logo: currentCategory?.logo || null,
      description: currentCategory?.description || '',
      metaDescription: currentCategory?.metaDescription || '',
      file: currentCategory?.cover || '',
      slug: currentCategory?.slug || '',
      phone: currentCategory?.phone || '',
      holderName: currentCategory?.holderName || '',
      holderEmail: currentCategory?.holderEmail || '',
      bankName: currentCategory?.bankName || '',
      AccountNo: currentCategory?.AccountNo || ''
    },
    enableReinitialize: true,
    validationSchema: NewCategorySchema,
    onSubmit: async (values) => {
      const { ...rest } = values;
      try {
        mutate({
          ...rest,
          ...(currentCategory && {
            currentSlug: currentCategory.slug
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
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my-uploads');
    const config = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentage = Math.floor((loaded * 100) / total);
        setstate({ ...state, loading: percentage });
      }
    };
    await axios
      .post(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, formData, config)
      .then(({ data }) => {
        setFieldValue('cover', {
          _id: data.public_id,
          url: data.secure_url
        });
        setstate({ ...state, loading: false });
      })
      .then(() => {
        if (values.file) {
          deleteMutate(values.cover._id);
        }
        setstate({ ...state, loading: false });
      });
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
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack direction="row" spacing={3} flexGrow="wrap">
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
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <div>
                      {categoryLoading ? (
                        <Skeleton variant="text" width={140} />
                      ) : (
                        <LabelStyle component={'label'} htmlFor="title">
                          Title
                        </LabelStyle>
                      )}
                      {categoryLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="title"
                          fullWidth
                          {...getFieldProps('title')}
                          onChange={handleTitleChange} // add onChange handler for title
                          error={Boolean(touched.title && errors.title)}
                          helperText={touched.title && errors.title}
                          sx={{ mt: 1 }}
                        />
                      )}
                    </div>
                    <div>
                      {categoryLoading ? (
                        <Skeleton variant="text" width={70} />
                      ) : (
                        <LabelStyle component={'label'} htmlFor="slug">
                          {' '}
                          {'Slug'}
                        </LabelStyle>
                      )}
                      {categoryLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <TextField
                          fullWidth
                          id="slug"
                          {...getFieldProps('slug')}
                          error={Boolean(touched.slug && errors.slug)}
                          helperText={touched.slug && errors.slug}
                        />
                      )}
                    </div>
                    <div>
                      {categoryLoading ? (
                        <Skeleton variant="text" width={100} />
                      ) : (
                        <LabelStyle component={'label'} htmlFor="meta-title">
                          {'Meta Title'}
                        </LabelStyle>
                      )}
                      {categoryLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="meta-title"
                          fullWidth
                          {...getFieldProps('metaTitle')}
                          error={Boolean(touched.metaTitle && errors.metaTitle)}
                          helperText={touched.metaTitle && errors.metaTitle}
                        />
                      )}
                    </div>
                  </Box>
                </Stack>
                <Stack mt={3} spacing={3} direction="row" flexGrow="wrap">
                  <Box sx={{ width: '100%' }}>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={100} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="description">
                        {' '}
                        {'Description'}{' '}
                      </LabelStyle>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={240} />
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
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={150} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="meta-description">
                        {' '}
                        {'Meta Description'}{' '}
                      </LabelStyle>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={240} />
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
                </Box>{' '}
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
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
                        {categoryLoading ? (
                          <Skeleton variant="text" width={150} />
                        ) : (
                          <LabelStyle component={'label'} htmlFor="holder-name">
                            Holder Name
                          </LabelStyle>
                        )}
                        {categoryLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={240} />
                        ) : (
                          <TextField
                            id="holder-name"
                            fullWidth
                            {...getFieldProps('holderName')}
                            error={Boolean(touched.holderName && errors.holderName)}
                            helperText={touched.holderName && errors.holderName}
                          />
                        )}
                      </div>
                      <div>
                        {categoryLoading ? (
                          <Skeleton variant="text" width={150} />
                        ) : (
                          <LabelStyle component={'label'} htmlFor="holder-email">
                            Holder Email
                          </LabelStyle>
                        )}
                        {categoryLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={240} />
                        ) : (
                          <TextField
                            id="holder-email"
                            fullWidth
                            {...getFieldProps('holderEmail')}
                            error={Boolean(touched.holderEmail && errors.holderEmail)}
                            helperText={touched.holderEmail && errors.holderEmail}
                          />
                        )}
                      </div>
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
                            {...getFieldProps('bankName')}
                            error={Boolean(touched.bankName && errors.bankName)}
                            helperText={touched.bankName && errors.bankName}
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
                            {...getFieldProps('AccountNo')}
                            error={Boolean(touched.AccountNo && errors.AccountNo)}
                            helperText={touched.AccountNo && errors.AccountNo}
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
                      {currentCategory ? 'Edit Category' : 'Create Category'}
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
