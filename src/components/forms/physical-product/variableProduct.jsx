import React, { useState, useEffect } from 'react';
import {
  Stack,
  Typography,
  Select,
  MenuItem,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  InputAdornment,
  Checkbox,
  ListItemText,
  OutlinedInput,
  IconButton,
  TextField,
  FormHelperText,
  Divider
} from '@mui/material';
import { MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { fCurrency } from 'src/utils/formatNumber';
import UploadMultiFile from 'src/components/upload/UploadMultiFile';
import uploadToSpaces from 'src/utils/upload';
import * as api from 'src/services';

function generateCombinations(data, index = 0, current = [], result = []) {
  if (index === data.length) {
    result.push({ name: current.join('/') });
    return null;
  }
  for (const value of data[index].value) {
    generateCombinations(data, index + 1, [...current, value], result);
  }
  return result;
}

export default function VariableProduct({ formik, variants, setCount, count, isInitialized, setInitialized, isLoading }) {
  const { setFieldValue, values, getFieldProps, touched, errors } = formik;
  const [availableVariants, setAvailableVariants] = useState(variants);
  const [state, setState] = useState({ isUploading: false, uploadProgress: 0, currentFileName: '', currentProcess: '' });

  useEffect(() => {
    setAvailableVariants(Array.isArray(variants) ? variants : []);
  }, [variants]);

  const { mutateAsync: deleteMutate } = useMutation(api.singleDeleteFile, {
    onError: (error) => toast.error(error?.response?.data?.message || 'Failed to delete file.')
  });

  const handleDrop = async (acceptedFiles, index) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const fileWithPreview = { ...file, preview: URL.createObjectURL(file) };

    const newFiles = [...(values.variants[index].images || []), fileWithPreview];
    setFieldValue(`variants[${index}].images`, newFiles);

    setState({ ...state, isUploading: true, currentFileName: file.name, currentProcess: 'Uploading' });

    try {
      const uploadedUrl = await uploadToSpaces(file, (progress) => {
        setState((prev) => ({ ...prev, uploadProgress: progress }));
      });

      const uploadedFiles = newFiles.map((f) => ({
        ...f,
        ...uploadedUrl,
      }));

      setFieldValue(`variants[${index}].images`, uploadedFiles);
      setState({ isUploading: false, uploadProgress: 100, currentFileName: '', currentProcess: '' });
    } catch (err) {
      console.error(err);
      setState({ isUploading: false, uploadProgress: 0, currentFileName: '', currentProcess: '' });
    }
  };

  const handleRemove = (file, index) => {
    const filtered = values.variants[index].images.filter(f => f !== file);
    if (file._id) deleteMutate(file._id);
    setFieldValue(`variants[${index}].images`, filtered);
  };

  const handleRemoveAll = (index) => {
    values.variants[index].images.forEach((image) => { if (image._id) deleteMutate(image._id); });
    setFieldValue(`variants[${index}].images`, []);
  };

  // Variant selection logic
  const handleAddVariant = () => setFieldValue('selectedVariants', [...values.selectedVariants, { name: '', value: [] }]);
  const handleVariantChange = (index, event) => {
    setCount(prev => prev + 1);
    const newName = event.target.value;
    const oldName = values.selectedVariants[index].name;
    const newSelectedVariants = [...values.selectedVariants];
    newSelectedVariants[index] = { name: newName, value: [] };
    setFieldValue('selectedVariants', newSelectedVariants);
    setAvailableVariants(prev => {
      let updated = [...prev];
      if (oldName) {
        const oldVar = variants.find(v => v.name === oldName);
        if (oldVar) updated.push(oldVar);
      }
      return updated.filter(v => v.name !== newName);
    });
  };
  const handleVariantValueChange = (index, event) => {
    setCount(prev => prev + 1);
    const selectedValues = Array.isArray(event.target.value) ? event.target.value : [event.target.value];
    const newSelectedVariants = [...values.selectedVariants];
    newSelectedVariants[index].value = selectedValues;
    setFieldValue('selectedVariants', newSelectedVariants);
  };
  const handleRemoveVariant = (index) => {
    const removedName = values.selectedVariants[index].name;
    const newSelected = values.selectedVariants.filter((_, i) => i !== index);
    setFieldValue('selectedVariants', newSelected);
    if (removedName) {
      const removedObj = variants.find(v => v.name === removedName);
      if (removedObj) setAvailableVariants([...availableVariants, removedObj]);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      const result = {
        names: values.selectedVariants.map(v => v.name),
        data: generateCombinations(values.selectedVariants) || []
      };

      if (isInitialized) {
        setFieldValue('variants', result.data.map(v => ({ ...v, variant: result.names.join('/'), stockQuantity: '', sku: '', images: [], blob: [] })));
      } else {
        setFieldValue('variants', result.data.map((v, i) => ({ ...v, variant: values.variants[i].variant, stockQuantity: values.variants[i].stockQuantity, sku: values.variants[i].sku, images: values.variants[i].images, blob: [] })));
        setInitialized(true);
      }
    }
  }, [count]);

  const isDigital = values.deliveryType === 'digital';

  return (
    <CardContent>
      <Stack gap={2}>
        {values.selectedVariants.map((variant, index) => (
          <Stack direction="row" spacing={2} alignItems="center" key={index}>
            <FormControl fullWidth>
              <Select value={variant.name} onChange={e => handleVariantChange(index, e)} renderValue={selected => selected}>
                {availableVariants.map(v => <MenuItem key={v.name} value={v.name}>{v.name}</MenuItem>)}
              </Select>
            </FormControl>
            {variant.name && (
              <FormControl fullWidth>
                <InputLabel>{`Values for ${variant.name}`}</InputLabel>
                <Select multiple value={variant.value} onChange={e => handleVariantValueChange(index, e)} input={<OutlinedInput label={`Values for ${variant.name}`} />} renderValue={selected => selected.join(', ')}>
                  {variants.find(v => v.name === variant.name)?.values.map(value => (
                    <MenuItem key={value} value={value}><Checkbox checked={variant.value.includes(value)} /><ListItemText primary={value} /></MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <IconButton onClick={() => handleRemoveVariant(index)}><MdDelete /></IconButton>
          </Stack>
        ))}

        {availableVariants.length > 0 && <Button onClick={handleAddVariant} variant="contained">Add Variant</Button>}
      </Stack>

      <Divider sx={{ mt: 3 }} />

      {values.variants?.map((item, i) => (
        <div key={item.name}>
          <Typography variant="h3" sx={{ textTransform: 'uppercase', py: 2 }}>{i + 1}. {item.name}</Typography>

          <Stack sx={{ display: 'grid', gridTemplateColumns: 'auto auto auto auto', gridGap: 16 }}>
            <Stack gap={1}>
              <Typography variant="overline">Stock Quantity</Typography>
              <TextField fullWidth type="number" {...getFieldProps(`variants[${i}].stockQuantity`)} error={Boolean(touched.variants?.[i]?.stockQuantity && errors.variants?.[i]?.stockQuantity)} helperText={touched.variants?.[i]?.stockQuantity && errors.variants?.[i]?.stockQuantity} />
            </Stack>

            <Stack gap={1}>
              <Typography variant="overline">Regular Price</Typography>
              <TextField fullWidth placeholder="0.00" InputProps={{ startAdornment: <InputAdornment position="start">{fCurrency(0).replace(/\d+(\.\d+)?/g, '').trim()}</InputAdornment>, type: 'number' }} {...getFieldProps(`variants[${i}].price`)} error={Boolean(touched.variants?.[i]?.price && errors.variants?.[i]?.price)} helperText={touched.variants?.[i]?.price && errors.variants?.[i]?.price} />
            </Stack>

            <Stack gap={1}>
              <Typography variant="overline">Sale Price</Typography>
              <TextField fullWidth placeholder="0.00" InputProps={{ startAdornment: <InputAdornment position="start">{fCurrency(0).replace(/\d+(\.\d+)?/g, '').trim()}</InputAdornment>, type: 'number' }} {...getFieldProps(`variants[${i}].salePrice`)} error={Boolean(touched.variants?.[i]?.salePrice && errors.variants?.[i]?.salePrice)} helperText={touched.variants?.[i]?.salePrice && errors.variants?.[i]?.salePrice} />
            </Stack>

            <Stack gap={1}>
              <Typography variant="overline">SKU</Typography>
              <TextField fullWidth {...getFieldProps(`variants[${i}].sku`)} error={Boolean(touched.variants?.[i]?.sku && errors.variants?.[i]?.sku)} helperText={touched.variants?.[i]?.sku && errors.variants?.[i]?.sku} />
            </Stack>
          </Stack>

          <Stack gap={1}>
            <Typography variant="overline">Product Images <span>1080 × 1080</span></Typography>
            <UploadMultiFile files={values?.variants[i].images} blob={values?.variants[i]?.images} loading={state.isUploading} onDrop={files => handleDrop(files, i)} onRemove={file => handleRemove(file, i)} onRemoveAll={() => handleRemoveAll(i)} error={Boolean(touched?.variants?.[i]?.images && errors?.variants?.[i]?.images)} />
            {touched?.variants?.[i]?.images && errors?.variants?.[i]?.images && <FormHelperText error>{errors?.variants?.[i]?.images}</FormHelperText>}
          </Stack>

          {isDigital && <Stack gap={1}><Typography variant="overline">Download Link</Typography><TextField fullWidth placeholder="https://example.com/file.zip" {...getFieldProps(`variants[${i}].downloadLink`)} error={Boolean(touched?.variants?.[i]?.downloadLink && errors?.variants?.[i]?.downloadLink)} helperText={touched?.variants?.[i]?.downloadLink && errors?.variants?.[i]?.downloadLink} /></Stack>}
        </div>
      ))}
    </CardContent>
  );
}
