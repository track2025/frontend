'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useRouter } from 'next-nprogress-bar';
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Grid,
  TextField,
  Typography,
  Skeleton,
  Select,
  FormHelperText,
  FormControl,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import uploadToSpaces from 'src/utils/upload';
import * as api from 'src/services';
import UploadSingleFile from 'src/components/upload/UploadSingleFile';

// lazy-load React Quill (for content editor)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import parseMongooseError from 'src/utils/errorHandler';

// ======================

EventForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};

// ======================

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

const STATUS_OPTIONS = ['draft', 'published', 'archived'];

export default function EventForm({ data: currentEvent, isLoading: eventLoading }) {
  const router = useRouter();

  const [state, setstate] = useState({
    loadingFeatured: false,
    loadingHero: false
  });

  // ---------------------
  // Mutations
  // ---------------------
  const { mutate, isLoading } = useMutation(
    currentEvent ? 'update' : 'create',
    currentEvent ? api.updateBlogByAdmin : api.addBlogByAdmin,
    {
      retry: false,
      onSuccess: (data) => {
        toast.success(data.message);
        router.push('/admin/blogs');
      },
      onError: (error) => {
        let errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'We ran into an issue. Please refresh the page or try again.', {
          duration: 10000
        });
      }
    }
  );

  const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
    onError: (error) => {
      toast.error(error.message || 'Failed to delete file');
    }
  });

  // ---------------------
  // Validation
  // ---------------------
  const EventSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    slug: Yup.string().required('Slug is required'),
    metaTitle: Yup.string().required('Meta title is required'),
    metaDescription: Yup.string().required('Meta description is required'),
    excerpt: Yup.string().required('Excerpt is required'),
    featuredImage: Yup.mixed().required('Featured image is required'),
    heroImage: Yup.mixed().required('Hero image is required'),
    author: Yup.string().required('Author name is required'),
    content: Yup.string().required('Content is required'),
    status: Yup.string().required('Status is required')
  });

  // ---------------------
  // Formik
  // ---------------------
  const formik = useFormik({
    initialValues: {
      title: currentEvent?.title || '',
      slug: currentEvent?.slug || '',
      metaTitle: currentEvent?.metaTitle || '',
      metaDescription: currentEvent?.metaDescription || '',
      excerpt: currentEvent?.excerpt || '',
      featuredImage: currentEvent?.featuredImage || null,
      heroImage: currentEvent?.heroImage || null,
      author: currentEvent?.author || '',
      category: currentEvent?.category || '',
      publishedDate: currentEvent?.publishedDate || '',
      readTime: currentEvent?.readTime || '',
      content: currentEvent?.content || '',
      featured: currentEvent?.featured || false,
      seoJunk: currentEvent?.seoJunk || '',
      status: currentEvent?.status || STATUS_OPTIONS[0]
    },
    enableReinitialize: true,
    validationSchema: EventSchema,
    onSubmit: async (values) => {
      try {
        const lowerCasedValues = Object.fromEntries(
          Object.entries(values).map(([key, value]) => [
            key,
            typeof value === 'string' ? value.toLowerCase() : value
          ])
        );

        mutate({
          ...lowerCasedValues,
          ...(currentEvent && {
            currentSlug: currentEvent.slug
          })
        });
      } catch (err) {
        console.error(err);
      }
    }
  });

  const { errors, touched, values, handleSubmit, setFieldValue, getFieldProps } = formik;

  // ---------------------
  // Handlers
  // ---------------------
  const handleDrop = async (acceptedFiles, fieldKey, loadingKey) => {
    setstate({ ...state, [loadingKey]: 2 });
    const file = acceptedFiles[0];
    if (file) Object.assign(file, { preview: URL.createObjectURL(file) });

    try {
      const uploaded = await uploadToSpaces(file, (progress) => {
        setstate({ ...state, [loadingKey]: progress });
      });

      setFieldValue(fieldKey, uploaded);
      if (values[fieldKey]?._id) {
        deleteMutate(values[fieldKey]._id);
      }

      setstate({ ...state, [loadingKey]: false });
    } catch (err) {
      console.error('Upload failed:', err);
      setstate({ ...state, [loadingKey]: false });
    }
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]+/g, '')
      .replace(/\s+/g, '-');
    formik.setFieldValue('slug', slug);
    formik.handleChange(e);
  };

  // ---------------------
  // Render
  // ---------------------
  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* LEFT SIDE */}
            <Grid item sx={{ width: { xs: '100%', md: '65%' } }}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {/* Title */}
                  <div>
                    {eventLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <LabelStyle component="label" htmlFor="title">
                        Title
                      </LabelStyle>
                    )}
                    {eventLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="title"
                        fullWidth
                        {...getFieldProps('title')}
                        onChange={handleTitleChange}
                        error={Boolean(touched.title && errors.title)}
                        helperText={touched.title && errors.title}
                      />
                    )}
                  </div>

                  {/* Excerpt */}
                  <div>
                    {eventLoading ? (
                      <Skeleton variant="text" width={100} />
                    ) : (
                      <LabelStyle component="label" htmlFor="excerpt">
                        Excerpt
                      </LabelStyle>
                    )}
                    {eventLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={100} />
                    ) : (
                      <TextField
                        id="excerpt"
                        fullWidth
                        multiline
                        rows={3}
                        {...getFieldProps('excerpt')}
                        error={Boolean(touched.excerpt && errors.excerpt)}
                        helperText={touched.excerpt && errors.excerpt}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    {eventLoading ? (
                      <Skeleton variant="text" width={120} />
                    ) : (
                      <LabelStyle component="label" htmlFor="content">
                        Content
                      </LabelStyle>
                    )}
                    {eventLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={240} />
                    ) : (
                      <ReactQuill
                        theme="snow"
                        value={values.content}
                        onChange={(val) => setFieldValue('content', val)}
                        style={{ height: '250px', marginBottom: '40px' }}
                      />
                    )}
                    {touched.content && errors.content && (
                      <FormHelperText error sx={{ px: 2 }}>
                        {errors.content}
                      </FormHelperText>
                    )}
                  </div>

                  <TextField
                    label="Seo Junk"
                    {...getFieldProps('seoJunk')}
                    placeholder=""
                    error={Boolean(touched.seoJunk && errors.seoJunk)}
                    helperText={touched.seoJunk && errors.seoJunk}
                  />

                  {/* Featured Image */}
                  <div>
                    {eventLoading ? <Skeleton variant="text" width={100} /> : <LabelStyle>Featured Image</LabelStyle>}
                    {eventLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={200} />
                    ) : (
                      <UploadSingleFile
                        file={values.featuredImage}
                        onDrop={(files) => handleDrop(files, 'featuredImage', 'loadingFeatured')}
                        error={Boolean(touched.featuredImage && errors.featuredImage)}
                        loading={state.loadingFeatured}
                        accept="image/*"
                      />
                    )}
                    {touched.featuredImage && errors.featuredImage && (
                      <FormHelperText error>{errors.featuredImage}</FormHelperText>
                    )}
                  </div>

                  {/* Hero Image */}
                  <div>
                    {eventLoading ? <Skeleton variant="text" width={100} /> : <LabelStyle>Hero Image</LabelStyle>}
                    {eventLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={200} />
                    ) : (
                      <UploadSingleFile
                        file={values.heroImage}
                        onDrop={(files) => handleDrop(files, 'heroImage', 'loadingHero')}
                        error={Boolean(touched.heroImage && errors.heroImage)}
                        loading={state.loadingHero}
                        accept="image/*"
                      />
                    )}
                    {touched.heroImage && errors.heroImage && <FormHelperText error>{errors.heroImage}</FormHelperText>}
                  </div>
                </Stack>
              </Card>
            </Grid>

            {/* RIGHT SIDE */}
            <Grid item sx={{ width: { xs: '100%', md: '30%' } }}>
              <Stack spacing={3} position="sticky" top={0}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    {/* Author */}
                    <div>
                      {eventLoading ? <Skeleton variant="text" width={100} /> : <LabelStyle>Author</LabelStyle>}
                      {eventLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <TextField
                          fullWidth
                          {...getFieldProps('author')}
                          error={Boolean(touched.author && errors.author)}
                          helperText={touched.author && errors.author}
                        />
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      {eventLoading ? <Skeleton variant="text" width={100} /> : <LabelStyle>Category</LabelStyle>}
                      {eventLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <TextField fullWidth {...getFieldProps('category')} />
                      )}
                    </div>

                    {/* Meta Title */}
                    <div>
                      {eventLoading ? <Skeleton variant="text" width={120} /> : <LabelStyle>Meta Title</LabelStyle>}
                      {eventLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <TextField
                          fullWidth
                          {...getFieldProps('metaTitle')}
                          error={Boolean(touched.metaTitle && errors.metaTitle)}
                          helperText={touched.metaTitle && errors.metaTitle}
                        />
                      )}
                    </div>

                    {/* Meta Description */}
                    <div>
                      {eventLoading ? (
                        <Skeleton variant="text" width={140} />
                      ) : (
                        <LabelStyle>Meta Description</LabelStyle>
                      )}
                      {eventLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={100} />
                      ) : (
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          {...getFieldProps('metaDescription')}
                          error={Boolean(touched.metaDescription && errors.metaDescription)}
                          helperText={touched.metaDescription && errors.metaDescription}
                        />
                      )}
                    </div>

                    {/* Featured Checkbox */}
                    {!eventLoading && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.featured}
                            onChange={(e) => setFieldValue('featured', e.target.checked)}
                          />
                        }
                        label="Mark as Featured"
                      />
                    )}

                    {/* Status */}
                    <FormControl fullWidth>
                      {eventLoading ? <Skeleton variant="text" width={80} /> : <LabelStyle>Status</LabelStyle>}
                      {eventLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <Select
                          native
                          {...getFieldProps('status')}
                          value={
                            values.status
                              ? values.status.charAt(0).toUpperCase() + values.status.slice(1).toLowerCase()
                              : ''
                          }
                          onChange={(e) =>
                            setFieldValue(
                              'status',
                              e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase()
                            )
                          }
                          className="text-capitalize"
                        >
                          <option value="" style={{ display: 'none' }} />
                          {STATUS_OPTIONS.map((s) => (
                            <option
                              key={s}
                              className="text-capitalize"
                              value={s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
                            >
                              {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
                            </option>
                          ))}
                        </Select>
                      )}
                      {touched.status && errors.status && <FormHelperText error>{errors.status}</FormHelperText>}
                    </FormControl>
                  </Stack>
                </Card>

                {/* Submit */}
                {eventLoading ? (
                  <Skeleton variant="rectangular" width="100%" height={56} />
                ) : (
                  <LoadingButton type="submit" variant="contained" size="large" loading={isLoading} sx={{ mt: 3 }}>
                    {currentEvent ? 'Update Blog' : 'Add New Blog'}
                  </LoadingButton>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
