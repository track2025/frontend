'use client';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

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
  Switch,
  FormControlLabel
} from '@mui/material';

// components
import UploadSingleFile from 'src/components/upload/UploadSingleFile';

// yup
import * as Yup from 'yup';

// toast
import toast from 'react-hot-toast';

// formik
import { Form, FormikProvider, useFormik } from 'formik';

// api
import * as api from 'src/services';
import uploadToSpaces from 'src/utils/upload';

// dynamically import react-quill (to avoid SSR issues)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

EventForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

const STATUS_OPTIONS = ['Open', 'Closed', 'Upcoming'];

export default function EventForm({ data: currentEvent, isLoading: eventLoading }) {
  const router = useRouter();

  const [state, setState] = useState({ loading: false });

  // --- Mutations
  const { mutate, isLoading } = useMutation(
    currentEvent ? 'update' : 'new',
    currentEvent ? api.updateEventByAdmin : api.addEventByAdmin,
    {
      retry: false,
      onSuccess: (data) => {
        toast.success(data.message);
        router.push('/admin/events');
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    }
  );

  const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    }
  });

  // --- Validation Schema
  const NewEventSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    slug: Yup.string().required('Slug is required'),
    trackName: Yup.string().required('Track Name is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    date: Yup.string().required('Date is required'),
    startTime: Yup.string().required('Start Time is required'),
    endTime: Yup.string().required('End Time is required'),
    type: Yup.string().required('Type is required'),
    category: Yup.string().required('Category is required'),
    image: Yup.mixed().required('Main image is required'),
    thumbnailImage: Yup.mixed().required('Thumbnail image is required'),
    content: Yup.string().required('Content is required')
  });

  // --- Formik
  const formik = useFormik({
    initialValues: {
      title: currentEvent?.title || '',
      slug: currentEvent?.slug || '',
      trackId: currentEvent?.trackId || '',
      trackName: currentEvent?.trackName || '',
      country: currentEvent?.country || '',
      countrySlug: currentEvent?.countrySlug || '',
      city: currentEvent?.city || '',
      date: currentEvent?.date || '',
      startTime: currentEvent?.startTime || '',
      endTime: currentEvent?.endTime || '',
      type: currentEvent?.type || '',
      category: currentEvent?.category || '',
      description: currentEvent?.description || '',
      fullDescription: currentEvent?.fullDescription || '',
      image: currentEvent?.image || null,
      thumbnailImage: currentEvent?.thumbnailImage || null,
      status: currentEvent?.status || STATUS_OPTIONS[0],
      featured: currentEvent?.featured || false,
      content: currentEvent?.content || '' // html content as string
    },
    enableReinitialize: true,
    validationSchema: NewEventSchema,
    onSubmit: async (values) => {
      try {
        mutate({
          ...values,
          ...(currentEvent && { currentSlug: currentEvent.slug })
        });
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  // --- File Uploads
  const handleUpload = async (acceptedFiles, field) => {
    setState({ ...state, loading: 2 });
    const file = acceptedFiles[0];

    if (file) {
      Object.assign(file, { preview: URL.createObjectURL(file) });
    }

    try {
      const uploaded = await uploadToSpaces(file, (progress) => {
        setState({ ...state, loading: progress });
      });

      setFieldValue(field, uploaded);

      if (values[field]?._id) {
        deleteMutate(values[field]._id);
      }

      setState({ ...state, loading: false });
    } catch (err) {
      console.error('Upload failed:', err);
      setState({ ...state, loading: false });
    }
  };

  // --- Slug Generator
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
            {/* Left Section */}
            <Grid
              item
              sx={{
                width: { xs: '100%', md: '100%' }
              }}
            >
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {/* Title */}
                  <div>
                    <LabelStyle htmlFor="title">Title</LabelStyle>
                    <TextField
                      id="title"
                      fullWidth
                      {...getFieldProps('title')}
                      onChange={handleTitleChange}
                      error={Boolean(touched.title && errors.title)}
                      helperText={touched.title && errors.title}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <LabelStyle htmlFor="description">Short Description</LabelStyle>
                    <TextField fullWidth id="description" rows={3} multiline {...getFieldProps('description')} />
                  </div>

                  {/* Full Description */}
                  <div>
                    <LabelStyle htmlFor="fullDescription">Full Description</LabelStyle>
                    <TextField
                      fullWidth
                      id="fullDescription"
                      rows={5}
                      multiline
                      {...getFieldProps('fullDescription')}
                    />
                  </div>

                  {/* Content (HTML) */}
                  <div>
                    <LabelStyle htmlFor="content">Content</LabelStyle>
                    <ReactQuill
                      theme="snow"
                      value={values.content}
                      onChange={(value) => setFieldValue('content', value)}
                      style={{ height: '250px', marginBottom: '40px' }}
                    />
                    {touched.content && errors.content && <FormHelperText error>{errors.content}</FormHelperText>}
                  </div>
                </Stack>
              </Card>
            </Grid>

            {/* Right Section */}
            <Grid
              item
              sx={{
                width: { xs: '100%', md: '100%' }
              }}
            >
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    {/* Other Fields */}
                    <TextField fullWidth label="Track Name" {...getFieldProps('trackName')} />
                    <TextField fullWidth label="Country" {...getFieldProps('country')} />
                    <TextField fullWidth label="City" {...getFieldProps('city')} />
                    <TextField
                      fullWidth
                      label="Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      {...getFieldProps('date')}
                    />
                    <TextField
                      fullWidth
                      label="Start Time"
                      type="time"
                      InputLabelProps={{ shrink: true }}
                      {...getFieldProps('startTime')}
                    />
                    <TextField
                      fullWidth
                      label="End Time"
                      type="time"
                      InputLabelProps={{ shrink: true }}
                      {...getFieldProps('endTime')}
                    />
                    <TextField fullWidth label="Type" {...getFieldProps('type')} />
                    <TextField fullWidth label="Category" {...getFieldProps('category')} />

                    <FormControl fullWidth>
                      <LabelStyle>Status</LabelStyle>
                      <Select native {...getFieldProps('status')}>
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.featured}
                          onChange={(e) => setFieldValue('featured', e.target.checked)}
                        />
                      }
                      label="Featured Event"
                    />
                  </Stack>

                  {/* Image */}
                  <div>
                    <LabelStyle>Event Image</LabelStyle>
                    <UploadSingleFile
                      file={values.image}
                      onDrop={(files) => handleUpload(files, 'image')}
                      error={Boolean(touched.image && errors.image)}
                      accept="image/*"
                      loading={state.loading}
                    />
                    {touched.image && errors.image && <FormHelperText error>{errors.image}</FormHelperText>}
                  </div>

                  {/* Thumbnail */}
                  <div>
                    <LabelStyle>Thumbnail Image</LabelStyle>
                    <UploadSingleFile
                      file={values.thumbnailImage}
                      onDrop={(files) => handleUpload(files, 'thumbnailImage')}
                      error={Boolean(touched.thumbnailImage && errors.thumbnailImage)}
                      accept="image/*"
                      loading={state.loading}
                    />
                    {touched.thumbnailImage && errors.thumbnailImage && (
                      <FormHelperText error>{errors.thumbnailImage}</FormHelperText>
                    )}
                  </div>
                </Card>

                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isLoading}
                  sx={{ ml: 'auto', mt: 3 }}
                >
                  {currentEvent ? 'Edit Event' : 'Add New Event'}
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
