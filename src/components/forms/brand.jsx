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
  Skeleton,
  MenuItem,
  IconButton,
  Button
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
// formik
import { Form, FormikProvider, useFormik, FieldArray } from 'formik';
// yup
import * as Yup from 'yup';
// api
import * as api from 'src/services';
// upload
import UploadSingleFile from 'src/components/upload/UploadSingleFile';
import uploadToSpaces from 'src/utils/upload';
// timezone
import TimezoneSelect from 'react-timezone-select';
import TimezoneSearch from '../settings/TimezoneSearch';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

const STATUS_OPTIONS = ['active', 'deactive'];

const FACILITY_OPTIONS = [
  'Pit Garages',
  'Hospitality Suite',
  'Timing System',
  'Medical Center',
  'Café',
  'Paddock Area',
  'Viewing Areas',
  'Parking for 500+ vehicles'
];

const KEYWORD_OPTIONS = [
  'bedford autodrome',
  'uk race track',
  'track days bedford',
  'motorsport venue uk',
  'racing circuit bedfordshire',
  'car track days uk',
  'bedford racing circuit',
  'thurleigh circuit'
];

export default function LocationsForm({ data: currentLocation, isLoading: locationLoading }) {
  const router = useRouter();
  const [state, setState] = useState({ loading: false });

  const { mutate, isLoading } = useMutation(
    currentLocation ? 'update' : 'new',
    currentLocation ? api.updateBrandByAdmin : api.addBrandByAdmin,
    {
      retry: false,
      onSuccess: (data) => {
        toast.success(data.message);
        router.push('/admin/locations');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error occurred');
      }
    }
  );

  const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
    onError: (error) => {
      toast.error(error.response?.data?.message);
    }
  });

  const LocationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    slug: Yup.string().required('Slug is required'),
    description: Yup.string().required('Description is required'),
    fullDescription: Yup.string(),
    logo: Yup.mixed().required('Logo is required'),
    bannerImage: Yup.mixed().required('Banner image is required'),
    thumbnailImage: Yup.mixed().required('Thumbnail image is required'),
    timezone: Yup.string().required('Timezone is required')
  });

  const formik = useFormik({
    initialValues: {
      name: currentLocation?.name || '',
      slug: currentLocation?.slug || '',
      description: currentLocation?.description || '',
      fullDescription: currentLocation?.fullDescription || '',
      country: currentLocation?.country || '',
      countryCode: currentLocation?.countryCode || '',
      city: currentLocation?.city || '',
      region: currentLocation?.region || '',
      address: currentLocation?.address || '',
      timezone: currentLocation?.timezone || '',
      length: currentLocation?.length || '',
      corners: currentLocation?.corners || '',
      width: currentLocation?.width || '',
      yearOpened: currentLocation?.yearOpened || '',
      facilities: currentLocation?.facilities || [],
      keywords: currentLocation?.keywords || [],
      website: currentLocation?.website || '',
      phone: currentLocation?.phone || '',
      email: currentLocation?.email || '',
      status: currentLocation?.status || STATUS_OPTIONS[0],
      logo: currentLocation?.logo || null,
      bannerImage: currentLocation?.bannerImage || null,
      thumbnailImage: currentLocation?.thumbnailImage || null,
      faqs: currentLocation?.faqs || [{ question: '', answer: '' }]
    },
    enableReinitialize: true,
    validationSchema: LocationSchema,
    onSubmit: async (values) => {
      try {
        mutate({
          ...values,
          ...(currentLocation && { currentSlug: currentLocation.slug })
        });
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  const handleTitleChange = (event) => {
    const title = event.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]+/g, '')
      .replace(/\s+/g, '-');
    formik.setFieldValue('slug', slug);
    formik.handleChange(event);
  };

  const handleDrop = async (fileKey, acceptedFiles) => {
    setState({ ...state, loading: 2 });
    const file = acceptedFiles[0];
    if (file) Object.assign(file, { preview: URL.createObjectURL(file) });

    try {
      const uploaded = await uploadToSpaces(file, (progress) => {
        setState({ ...state, loading: progress });
      });

      setFieldValue(fileKey, uploaded);
      setState({ ...state, loading: false });
    } catch (err) {
      console.error('Upload failed:', err);
      setState({ ...state, loading: false });
    }
  };

  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          {/* ================= Top Section ================= */}
          <Box sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              {/* Left Section */}
              <Grid sx={{ width: '50%' }} item xs={12} md={7}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack spacing={3}>
                    {[
                      { name: 'name', label: 'Location Name', onChange: handleTitleChange },
                      { name: 'description', label: 'Short Description', multiline: true, rows: 3 },
                      { name: 'fullDescription', label: 'Full Description', multiline: true, rows: 6 },
                      { name: 'country', label: 'Country' },
                      { name: 'countryCode', label: 'Country Code' },
                      { name: 'city', label: 'City' },
                      { name: 'region', label: 'Region' },
                      { name: 'address', label: 'Address', multiline: true, rows: 2 }
                    ].map((field) => (
                      <div key={field.name}>
                        {locationLoading ? (
                          <>
                            <Skeleton variant="text" width={150} />
                            <Skeleton variant="rectangular" width="100%" height={56} />
                          </>
                        ) : (
                          <>
                            <LabelStyle htmlFor={field.name}>{field.label}</LabelStyle>
                            <TextField
                              id={field.name}
                              fullWidth
                              {...getFieldProps(field.name)}
                              onChange={field.onChange || formik.handleChange}
                              multiline={field.multiline}
                              rows={field.rows}
                              error={Boolean(touched[field.name] && errors[field.name])}
                              helperText={touched[field.name] && errors[field.name]}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </Stack>
                </Card>
              </Grid>

              {/* Right Section */}
              <Grid sx={{ width: '45%' }} item xs={12} md={6}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack spacing={3}>
                    {/* Timezone */}
                    {locationLoading ? (
                      <>
                        <Skeleton variant="text" width={120} />
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      </>
                    ) : (
                      <>
                        <LabelStyle>Timezone</LabelStyle>
                        {/* <TimezoneSelect
                          value={values.timezone}
                          onChange={(val) => setFieldValue('timezone', val.value)}
                        /> */}

                        <TimezoneSearch
                          value={values.timezone}
                          onChange={(val) => setFieldValue('timezone', val)}
                          error={touched.timezone && Boolean(errors.timezone)}
                          helperText={touched.timezone && errors.timezone}
                        />
                        {touched.timezone && errors.timezone && (
                          <FormHelperText error>{errors.timezone}</FormHelperText>
                        )}
                      </>
                    )}

                    {/* Numeric fields */}
                    {[
                      { name: 'length', label: 'Track Length' },
                      { name: 'corners', label: 'Number of Corners' },
                      { name: 'width', label: 'Track Width' },
                      { name: 'yearOpened', label: 'Year Opened' },
                      { name: 'website', label: 'Website' },
                      { name: 'phone', label: 'Phone' },
                      { name: 'email', label: 'Email' }
                    ].map((field) => (
                      <div key={field.name}>
                        {locationLoading ? (
                          <>
                            <Skeleton variant="text" width={120} />
                            <Skeleton variant="rectangular" width="100%" height={56} />
                          </>
                        ) : (
                          <>
                            <LabelStyle htmlFor={field.name}>{field.label}</LabelStyle>
                            <TextField
                              id={field.name}
                              fullWidth
                              {...getFieldProps(field.name)}
                              error={Boolean(touched[field.name] && errors[field.name])}
                              helperText={touched[field.name] && errors[field.name]}
                            />
                          </>
                        )}
                      </div>
                    ))}

                    {/* Facilities */}
                    <FormControl fullWidth>
                      <LabelStyle>Facilities</LabelStyle>
                      <Select
                        multiple
                        value={values.facilities}
                        onChange={(e) => setFieldValue('facilities', e.target.value)}
                        renderValue={(selected) => selected.join(', ')}
                      >
                        {FACILITY_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Keywords */}
                    <FormControl fullWidth>
                      <LabelStyle>Keywords</LabelStyle>
                      <Select
                        multiple
                        value={values.keywords}
                        onChange={(e) => setFieldValue('keywords', e.target.value)}
                        renderValue={(selected) => selected.join(', ')}
                      >
                        {KEYWORD_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Status */}
                    <FormControl fullWidth>
                      <LabelStyle>Status</LabelStyle>
                      <Select native {...getFieldProps('status')}>
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* ================= Bottom Section ================= */}
          <Box mt={4}>
            <Grid container spacing={2}>
              {/* Images */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <LabelStyle>Logo</LabelStyle>
                  <UploadSingleFile
                    file={values.logo}
                    onDrop={(files) => handleDrop('logo', files)}
                    loading={state.loading}
                    accept="image/*"
                  />
                  {touched.logo && errors.logo && <FormHelperText error>{errors.logo}</FormHelperText>}
                </Card>
              </Grid>

              <Grid item xs={12} md={5}>
                <Card sx={{ p: 3 }}>
                  <LabelStyle>Banner Image</LabelStyle>
                  <UploadSingleFile
                    file={values.bannerImage}
                    onDrop={(files) => handleDrop('bannerImage', files)}
                    loading={state.loading}
                    accept="image/*"
                  />
                  {touched.bannerImage && errors.bannerImage && (
                    <FormHelperText error>{errors.bannerImage}</FormHelperText>
                  )}
                </Card>
              </Grid>

              <Grid item xs={12} md={5}>
                <Card sx={{ p: 3 }}>
                  <LabelStyle>Thumbnail Image</LabelStyle>
                  <UploadSingleFile
                    file={values.thumbnailImage}
                    onDrop={(files) => handleDrop('thumbnailImage', files)}
                    loading={state.loading}
                    accept="image/*"
                  />
                  {touched.thumbnailImage && errors.thumbnailImage && (
                    <FormHelperText error>{errors.thumbnailImage}</FormHelperText>
                  )}
                </Card>
              </Grid>
            </Grid>

            {/* FAQs Section */}
            <Card sx={{ p: 3, mt: 3 }}>
              <Stack spacing={3}>
                <LabelStyle>FAQs</LabelStyle>
                <FieldArray
                  name="faqs"
                  render={(arrayHelpers) => (
                    <>
                      {values.faqs.map((faq, index) => (
                        <Stack key={index} spacing={2} sx={{ mb: 2, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
                          <TextField label="Question" fullWidth {...getFieldProps(`faqs[${index}].question`)} />
                          <TextField
                            label="Answer"
                            fullWidth
                            multiline
                            rows={3}
                            {...getFieldProps(`faqs[${index}].answer`)}
                          />
                          <IconButton
                            color="error"
                            onClick={() => arrayHelpers.remove(index)}
                            disabled={values.faqs.length === 1}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      ))}
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => arrayHelpers.push({ question: '', answer: '' })}
                      >
                        Add FAQ
                      </Button>
                    </>
                  )}
                />
              </Stack>
            </Card>
          </Box>

          {/* Submit */}
          <Box mt={3} textAlign="right">
            <LoadingButton type="submit" variant="contained" size="large" loading={isLoading}>
              {currentLocation ? 'Update Location' : 'Add Location'}
            </LoadingButton>
          </Box>
        </Form>
      </FormikProvider>
    </Box>
  );
}

LocationsForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};
