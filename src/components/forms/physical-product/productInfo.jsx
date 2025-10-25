import React, { useState } from 'react';
import {
  Stack,
  TextField,
  Skeleton,
  Typography,
  FormHelperText,
  Tooltip,
  IconButton,
  Chip,
  Collapse
} from '@mui/material';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import Autocomplete from '@mui/material/Autocomplete';
import TipTapEditor from '../../tip-tap-editor';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import * as api from 'src/services';
import { UploadMultiFile } from 'src/components/upload';
import uploadToSpaces from 'src/utils/upload';

export default function ProductInfo(props) {
  const [state, setState] = useState({
    loading: false,
    isUploading: false,
    uploadProgress: 0,
    currentFileName: '',
    currentProcess: ''
  });

  const { formik, handleTitleChange, isLoading } = props;
  const { values, errors, touched, getFieldProps, setFieldValue } = formik;

  const { mutateAsync: deleteMutate } = useMutation(api.singleDeleteFile, {
    onError: (error) => toast.error(error?.response?.data?.message || 'Failed to delete file.')
  });

  // Handle multiple file drop
  const handleDrop = async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const fileWithPreview = {
      ...file,
      preview: URL.createObjectURL(file)
    };

    // Add file to images array
    const newFiles = [...(values.images || []), fileWithPreview];
    setFieldValue('images', newFiles);

    // Start upload
    setState({ ...state, isUploading: true, currentFileName: file.name, currentProcess: 'Uploading' });

    try {
      const uploadedUrl = await uploadToSpaces(file, (progress) => {
        setState((prev) => ({ ...prev, uploadProgress: progress }));
      });

      console.log('Uploaded URL:', uploadedUrl);

      // Replace local file preview with uploaded URL
      const uploadedFiles = newFiles.map((f) => ({
        ...f,
        ...uploadedUrl,
      }));


      setFieldValue('images', uploadedFiles);

      setState({ ...state, isUploading: false, uploadProgress: 100, currentFileName: '', currentProcess: '' });

      console.log('Upload successful:', uploadedFiles);
    } catch (err) {
      console.error('Upload failed:', err);
      setState({ ...state, isUploading: false, uploadProgress: 0, currentFileName: '', currentProcess: '' });
    }
  };

  const handleRemove = (fileToRemove) => {
    setFieldValue('images', values.images.filter(f => f !== fileToRemove));
  };

  const handleRemoveAll = () => {
    setFieldValue('images', []);
  };

  return (
    <Stack gap={2}>
      {/* Product Name, Slug, Meta Title */}
      <Stack sx={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: 16 }}>
        <Stack gap={1}>
          <Typography variant="overline">Product Name</Typography>
          <TextField
            fullWidth
            {...getFieldProps('name')}
            onChange={handleTitleChange}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />
        </Stack>
        <Stack gap={1}>
          <Typography variant="overline">Slug</Typography>
          <TextField
            fullWidth
            {...getFieldProps('slug')}
            error={Boolean(touched.slug && errors.slug)}
            helperText={touched.slug && errors.slug}
          />
        </Stack>
        <Stack gap={1}>
          <Typography variant="overline">Meta Title</Typography>
          <TextField
            fullWidth
            {...getFieldProps('metaTitle')}
            error={Boolean(touched.metaTitle && errors.metaTitle)}
            helperText={touched.metaTitle && errors.metaTitle}
          />
        </Stack>
      </Stack>

      {/* Short Description & Meta Description */}
      <Stack sx={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: 16 }}>
        <Stack gap={1}>
          <Typography variant="overline">Short Description</Typography>
          <TextField
            fullWidth
            {...getFieldProps('description')}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
            multiline
            rows={3}
          />
          <Typography variant="overline">Meta Description</Typography>
          <TextField
            fullWidth
            {...getFieldProps('metaDescription')}
            error={Boolean(touched.metaDescription && errors.metaDescription)}
            helperText={touched.metaDescription && errors.metaDescription}
            multiline
            rows={3}
          />
          <Typography variant="overline">
            Tags
            <Tooltip title="Press enter to add tag" placement="top" arrow>
              <IconButton sx={{ color: 'text.secondary', p: 0, px: 1 }} size="small">
                <FaRegCircleQuestion />
              </IconButton>
            </Tooltip>
          </Typography>
          <Autocomplete
            multiple
            freeSolo
            value={values.tags}
            onChange={(e, newValue) => setFieldValue('tags', newValue)}
            options={[]}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => <Chip size="small" {...getTagProps({ index })} label={option} />)
            }
            renderInput={(params) => (
              <TextField {...params} error={Boolean(touched.tags && errors.tags)} helperText={touched.tags && errors.tags} />
            )}
          />
        </Stack>

        {/* Long Description */}
        <Stack gap={1}>
          <Typography variant="overline">Long Description (HTML Supported)</Typography>
          <TipTapEditor onChange={(v) => setFieldValue('content', v)} value={values?.content} />
        </Stack>
      </Stack>

      {/* Product Images */}
      <Stack gap={1}>
        <Typography variant="overline">Product Images <span>Recommended Ratio: 1:1</span></Typography>
        <UploadMultiFile
          files={values.images || []}
          blob={values.images || []}
          onDrop={handleDrop}
          onRemove={handleRemove}
          onRemoveAll={handleRemoveAll}
          loading={state.isUploading}
          isUploading={state.isUploading}
          uploadProgress={state.uploadProgress}
          currentFileName={state.currentFileName}
          currentProcess={state.currentProcess}
        />
        {touched.images && errors.images && <FormHelperText error>{errors.images}</FormHelperText>}
      </Stack>

      <Collapse in={values.deliveryType === 'digital'}>
        <Stack gap={1}>
          <Typography variant="overline">Demo URL</Typography>
          <TextField
            fullWidth
            {...getFieldProps('demo')}
            error={Boolean(touched.demo && errors.demo)}
            helperText={touched.demo && errors.demo}
          />
        </Stack>
      </Collapse>
    </Stack>
  );
}
