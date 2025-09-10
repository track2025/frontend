'use client';
import * as Yup from 'yup';
import React, { useState, useRef } from 'react';
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
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  lineHeight: 2.5
}));

// ----------------------------------------------------------------------
let ffmpeg;
const loadFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
  });
  return ffmpeg;
};

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
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentFileName, setCurrentFileName] = useState('');
  const [currentProcess, setCurrentProcess] = useState('');
  console.log(shops);
  const ffmpegRef = useRef(null);

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
          toast.error(error?.data?.message || error?.response?.data?.message || 'An error occurred');
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
      category:
        currentProduct?.vehicle_make || currentProduct?.category || (categories.length && categories[0]?._id) || '',
      shop: isVendor ? null : currentProduct?.shop || (shops?.length && shops[0]?._id) || '',
      subCategory:
        currentProduct?.vehicle_model ||
        currentProduct?.subCategory ||
        (categories.length && categories[0].subCategories[0]?.name) ||
        '',
      isFeatured: currentProduct?.isFeatured || false,
      priceSale: currentProduct?.priceSale || pricing?.defaultPrice || '',
      currency: currentProduct?.currency || pricing?.defaultCurrency || '',
      images: currentProduct?.images || [],
      dateCaptured:
        (currentProduct?.dateCaptured && new Date(currentProduct?.dateCaptured).toISOString().split('T')[0]) ||
        new Date().toISOString().split('T')[0],
      Multiple: currentProduct?.Multiple || false
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values) => {
      const isPresetLocation = /^[a-f\d]{24}$/i.test(values?.brand);
      let cleanedValues = { ...values };
      if (!isPresetLocation) cleanedValues = { ...cleanedValues, location: values?.brand, brand: null };

      const isPresetMake = /^[a-f\d]{24}$/i.test(values?.category);
      if (!isPresetMake) cleanedValues = { ...cleanedValues, vehicle_make: values?.category, brand: null };

      const getNameById = (array, id) => array?.find((item) => item._id?.toString() === id?.toString())?.name || null;
      const selectedCategoryName = isPresetMake ? getNameById(categories, values?.category) : null;
      const selectedBrandName = getNameById(brands, values?.brand);
      const allSubCategories = categories.flatMap((category) => category.subCategories || []);
      const selectedSubCategoryName = getNameById(allSubCategories, values?.subCategory);
      const selectedShopName = getNameById(shops, values?.shop);

      if (selectedBrandName) cleanedValues = { ...cleanedValues, location: selectedBrandName };
      if (selectedCategoryName) cleanedValues = { ...cleanedValues, vehicle_make: selectedCategoryName };
      if (!selectedCategoryName) cleanedValues = { ...cleanedValues, category: null };
      if (selectedSubCategoryName) cleanedValues = { ...cleanedValues, vehicle_model: selectedSubCategoryName };
      if (!selectedSubCategoryName)
        cleanedValues = { ...cleanedValues, vehicle_model: values?.subCategory, subCategory: null };

      if (values?.Multiple)
        cleanedValues = {
          ...cleanedValues,
          category: null,
          name: null,
          subCategory: null,
          vehicle_make: null,
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
      let errorMessage = parseMongooseError(error.response.data.message);
      toast.error(errorMessage, {
        duration: 10000 // Prevents auto-dismissal
      });
    }
  });

  const ensureFileObject = (file) => {
    if (file instanceof File) return file;
    if (file instanceof Blob) return new File([file], 'uploaded_file', { type: file.type });
    if (file instanceof Uint8Array) return new File([file], 'uploaded_file');
    return new File([JSON.stringify(file)], 'uploaded_file');
  };

  const getFileType = (file) => {
    // First check the explicit type property
    if (file.type) return file.type;

    // Fallback to filename extension
    const fileName = file.name || '';
    if (fileName.endsWith('.mp4')) return 'video/mp4';
    if (fileName.endsWith('.mov')) return 'video/quicktime';
    if (fileName.endsWith('.avi')) return 'video/x-msvideo';

    // Default to empty string if unknown
    return '';
  };

  const createWatermarkImage = async () => {
    // Create a canvas with your watermark design
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');

    // Draw your watermark design
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('LapSnaps', 10, 50);

    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });
  };

  const generateVideoPreview = async (videoFile) => {
    let ffmpeg;
    let inputFilename, watermarkFilename, outputFilename;

    try {
      ffmpeg = await loadFFmpeg();

      const timestamp = Date.now();
      inputFilename = `input_${timestamp}${getFileExtension(videoFile.name)}`;
      watermarkFilename = `watermark_${timestamp}.png`; // we'll write fetched file as this
      outputFilename = `output_${timestamp}.mp4`;

      // Load watermark from public folder
      const watermarkResponse = await fetch('/watermark.png');
      if (!watermarkResponse.ok) throw new Error('Failed to load watermark.png');
      const watermarkBlob = await watermarkResponse.blob();
      const watermarkData = new Uint8Array(await watermarkBlob.arrayBuffer());

      // Convert video to Uint8Array
      const videoData = new Uint8Array(await videoFile.arrayBuffer());

      // Write input files to ffmpeg FS
      await ffmpeg.writeFile(inputFilename, videoData);
      await ffmpeg.writeFile(watermarkFilename, watermarkData);

      // Overlay watermark covering the whole video at 0:0
      await ffmpeg.exec([
        '-i',
        inputFilename,
        '-i',
        watermarkFilename,
        '-filter_complex',
        'overlay=0:0',
        '-t',
        '10',
        '-c:v',
        'libx264',
        '-preset',
        'ultrafast',
        '-crf',
        '28',
        '-c:a',
        'aac',
        '-b:a',
        '96k',
        '-movflags',
        '+faststart',
        '-y',
        outputFilename
      ]);

      const outputData = await ffmpeg.readFile(outputFilename);
      if (!outputData || outputData.length === 0) throw new Error('Empty output generated');

      return new Blob([outputData.buffer], { type: 'video/mp4' });
    } catch (error) {
      console.error('Video processing failed:', error);
      return videoFile.slice(0, 20 * 1000 * 1000);
    } finally {
      if (ffmpeg?.deleteFile) {
        try {
          inputFilename && (await ffmpeg.deleteFile(inputFilename));
        } catch {}
        try {
          watermarkFilename && (await ffmpeg.deleteFile(watermarkFilename));
        } catch {}
        try {
          outputFilename && (await ffmpeg.deleteFile(outputFilename));
        } catch {}
      }
    }
  };

  // Helper function
  const getFileExtension = (filename) => {
    return filename?.match(/\.[0-9a-z]+$/i)?.[0] || '';
  };

  const addWatermark = (imageFile, watermarkText) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 1. Calculate dimensions while maintaining aspect ratio
        const maxWidth = 1200;
        const scale = Math.min(maxWidth / img.width, 1); // Never scale up
        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        // 2. Enable high-quality image scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 3. Draw image with better interpolation
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 4. Improved watermark styling
        const fontSize = Math.max(canvas.width * 0.08, 40); // Responsive font size
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'; // Slightly more visible
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 5. Rotate canvas for diagonal watermark
        ctx.translate(canvas.width / 2, canvas.height / 2);
        const angle = -Math.atan(canvas.height / canvas.width);
        ctx.rotate(angle);

        // 6. Better watermark positioning
        const horizontalSpacing = canvas.width * 0.4;
        const verticalSpacing = canvas.height * 0.2;

        // 7. Draw watermark pattern
        for (let x = -canvas.width; x < canvas.width * 2; x += horizontalSpacing) {
          for (let y = -canvas.height; y < canvas.height * 2; y += verticalSpacing) {
            ctx.fillText(watermarkText, x, y);
          }
        }

        // 8. Reset transformations
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // 9. Export with higher quality
        canvas.toBlob(
          (blob) => {
            resolve(
              new File([blob], `watermarked_${imageFile.name}`, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
            );
          },
          'image/jpeg',
          0.92 // Increased quality (0.85-0.95 is optimal)
        );
      };
      img.onerror = () => {
        console.error('Image loading failed');
        resolve(imageFile); // Fallback to original if error occurs
      };
    });

  const [orignalImage, setorignalImageValue] = useState();

  // 1. Enhanced File Type Detection
  const VIDEO_MIME_TYPES = [
    'video/mp4',
    'application/mp4',
    'video/x-m4v',
    'video/quicktime', // MOV
    'video/x-msvideo', // AVI
    'video/webm',
    'video/x-matroska', // MKV
    'video/ogg'
  ];

  const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.ogv'];

  const isVideoFile = (file) => {
    // Check MIME type first
    if (file.type && VIDEO_MIME_TYPES.includes(file.type.toLowerCase())) {
      return true;
    }

    // Fallback to file extension
    const fileName = file.name || '';
    return VIDEO_EXTENSIONS.some((ext) => fileName.toLowerCase().endsWith(ext));
  };

  // 2. Updated handleDrop Function
  const handleDrop = async (acceptedFiles) => {
    if (isUploading) return;

    setIsUploading(true);
    setLoading(true);
    setUploadProgress(0);

    const filesWithPreview = acceptedFiles.map((file) => {
      const preview = isVideoFile(file) ? URL.createObjectURL(file) : URL.createObjectURL(file);
      return file;
    });

    setFieldValue('blob', (values.blob || []).concat(filesWithPreview));

    try {
      const uploads = [];

      for (let i = 0; i < filesWithPreview.length; i++) {
        const file = filesWithPreview[i];
        setCurrentFileIndex(i + 1);
        setCurrentFileName(file.name);

        if (isVideoFile(file)) {
          try {
            setCurrentProcess('Processing video');
            // Ensure proper File object
            const videoFile =
              file instanceof File
                ? file
                : new File([file], file.name || 'video.mp4', {
                    type: file.type || 'video/mp4'
                  });

            // Generate preview (converts all formats to MP4)
            setUploadProgress(10);
            const watermarkedPreview = await generateVideoPreview(videoFile);
            setUploadProgress(30);

            setCurrentProcess('Uploading original video');
            const originalUrl = await uploadToSpaces(videoFile, (progress) => {
              setUploadProgress(30 + progress * 0.3); // 30-60% for original upload
            });

            setCurrentProcess('Uploading preview video');
            const previewUrl = await uploadToSpaces(
              new File([watermarkedPreview], `preview_${file.name.replace(/\.[^/.]+$/, '.mp4')}`, {
                type: 'video/mp4',
                lastModified: Date.now()
              }),
              (progress) => {
                setUploadProgress(60 + progress * 0.4); // 60-100% for preview upload
              }
            );

            uploads.push({
              type: 'video',
              original: originalUrl,
              preview: previewUrl
            });
          } catch (error) {
            console.error('Video processing failed:', error);
            toast.error('Video processing failed');
            throw new Error('Video processing failed:', error);
          }
        } else if (file.type?.startsWith('image/')) {
          // Existing image processing
          setCurrentProcess('Adding watermark');
          setUploadProgress(10);
          const watermarked = await addWatermark(file, 'LapSnaps');
          setUploadProgress(30);

          setCurrentProcess('Uploading original image');
          const originalUrl = await uploadToSpaces(file, (progress) => {
            setUploadProgress(30 + progress * 0.3); // 30-60% for original upload
          });

          setCurrentProcess('Uploading watermarked image');
          const watermarkedUrl = await uploadToSpaces(watermarked, (progress) => {
            setUploadProgress(60 + progress * 0.4); // 60-100% for watermarked upload
          });

          uploads.push({
            type: 'image',
            original: originalUrl,
            preview: watermarkedUrl
          });
        } else {
          toast.error('Unsupported file type');
          throw new Error('Unsupported file type');
        }

        // Reset for next file
        setUploadProgress(0);
      }

      if (uploads.length > 0) {
        const previewUrls = uploads.map((fileObj) => fileObj.preview);
        const originalUrls = uploads.map((fileObj) => fileObj.original);

        setFieldValue('images', values.images.concat(previewUrls));
        setorignalImageValue(originalUrls);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error(
        err.message.includes('Unsupported')
          ? 'Please upload only images or supported videos (MP4, MOV, AVI, WebM)'
          : 'Upload failed. Please try again.'
      );
    } finally {
      setIsUploading(false);
      setLoading(false);
      setUploadProgress(0);
      setCurrentFileIndex(0);
      setCurrentFileName('');
      setCurrentProcess('');
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
            <Grid
              item
              sx={{
                width: {
                  xs: '100%',
                  md: '65%'
                }
              }}
            >
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
                    {!values.Multiple && (
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
                            onChange={handleTitleChange}
                            error={Boolean(touched.name && errors.name)}
                            helperText={touched.name && errors.name}
                          />
                        )}
                      </div>
                    )}
                    <div>
                      <Grid container spacing={2}>
                        {isVendor ? null : (
                          <Grid
                            item
                            sx={{
                              width: {
                                xs: '100%',
                                md: '100%'
                              }
                            }}
                          >
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

                        {!values.Multiple && (
                          <Grid
                            item
                            sx={{
                              width: {
                                xs: '100%',
                                md: '100%'
                              }
                            }}
                          >
                            <FormControl fullWidth>
                              {isInitialized ? (
                                <Skeleton variant="text" width={100} />
                              ) : (
                                <LabelStyle component={'label'} htmlFor="category-select">
                                  {'Vehicle Make'}
                                </LabelStyle>
                              )}

                              {!categoryLoading ? (
                                <Autocomplete
                                  freeSolo
                                  id="category-select"
                                  options={
                                    categories?.map((category) => ({
                                      id: category._id,
                                      label: category.name
                                    })) || []
                                  }
                                  value={
                                    values.category
                                      ? {
                                          id: values.category,
                                          label:
                                            categories?.find((c) => c._id === values.category)?.name || values.category
                                        }
                                      : null
                                  }
                                  onInputChange={(event, newInputValue) => {
                                    if (typeof newInputValue === 'string') {
                                      // Handle free text input
                                      setFieldValue('category', newInputValue);
                                    } else if (newInputValue && newInputValue.id) {
                                      // Handle selection from dropdown
                                      setFieldValue('category', newInputValue.id);
                                    } else {
                                      setFieldValue('category', '');
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} error={touched.category && Boolean(errors.category)} />
                                  )}
                                />
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
                        )}
                        {!values.Multiple && (
                          <Grid
                            item
                            sx={{
                              width: {
                                xs: '100%',
                                md: '100%'
                              }
                            }}
                          >
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
                                        label: subCategory.name
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
                                            values.subCategory
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
                          </Grid>
                        )}
                        <Grid
                          item
                          sx={{
                            width: {
                              xs: '100%',
                              md: '100%'
                            }
                          }}
                        >
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
                              options={
                                brands?.map((brand) => ({
                                  id: brand._id,
                                  label: brand.name
                                })) || []
                              }
                              value={
                                values.brand
                                  ? {
                                      id: values.brand,
                                      label: brands?.find((b) => b._id === values.brand)?.name || values.brand
                                    }
                                  : null
                              }
                              onChange={(event, newValue) => {
                                const newValueId = newValue?.id || newValue;
                                setFieldValue('brand', newValueId);
                              }}
                              onInputChange={(event, newInputValue, reason) => {
                                // Handles free typing
                                if (reason === 'input') {
                                  setFieldValue('brand', newInputValue);
                                }
                              }}
                              renderInput={(params) => (
                                <TextField {...params} error={touched.brand && Boolean(errors.brand)} />
                              )}
                            />

                            {touched.brand && errors.brand && (
                              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                {touched.brand && errors.brand}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid
                          item
                          sx={{
                            width: {
                              xs: '100%',
                              md: '100%'
                            }
                          }}
                        >
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
                                shrink: true
                              }}
                              sx={{
                                width: {
                                  xs: '100%',
                                  md: '100%'
                                }
                              }}
                              value={values.dateCaptured}
                              onChange={(e) => {
                                formik.setFieldValue('dateCaptured', e.target.value);
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

                        <Grid
                          item
                          sx={{
                            width: {
                              xs: '100%',
                              md: '100%'
                            }
                          }}
                        >
                          <div>
                            <LabelStyle component={'label'} htmlFor="product-image">
                              {'Pictures/Videos'} <span></span>
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
                                    borderRadius: 1
                                  }}
                                >
                                  <CircularProgress color="inherit" />
                                  <Typography variant="body2" sx={{ mt: 2, color: 'common.white' }}>
                                    {currentProcess}: {currentFileName} ({currentFileIndex}/{values.blob?.length || 0})
                                  </Typography>
                                  <Typography variant="body2" sx={{ mt: 1, color: 'common.white' }}>
                                    Progress: {Math.round(uploadProgress)}%
                                  </Typography>
                                </Backdrop>
                              )}
                              <UploadMultiFile
                                id="product-image"
                                showPreview
                                maxSize={20971520} // 20MB in bytes (20 * 1024 * 1024)
                                maxFiles={100}
                                files={values?.images}
                                loading={loading}
                                onDrop={handleDrop}
                                onRemove={handleRemove}
                                onRemoveAll={handleRemoveAll}
                                blob={values.blob}
                                error={Boolean(touched.images && errors.images)}
                                isUploading={isUploading}
                                uploadProgress={uploadProgress}
                                currentFileName={currentFileName}
                                currentProcess={currentProcess}
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
            <Grid
              item
              sx={{
                width: {
                  xs: '100%',
                  md: '30%'
                }
              }}
            >
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
                        {data?.data?.map((cur, index) => (
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
                  {!isVendor && (
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
                  )}
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
