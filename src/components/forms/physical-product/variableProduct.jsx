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
    onError: (error) => {
      let errorMessage = parseMongooseError(error);
      toast.error(errorMessage || 'Something went wrong!');
    }
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

  // Variant selection logic - UPDATED FOR DUPLICATE NAMES
  const handleAddVariant = () => {
    if (availableVariants.length > 0) {
      const firstAvailable = availableVariants[0];
      setFieldValue('selectedVariants', [
        ...values.selectedVariants,
        {
          ...firstAvailable,
          value: firstAvailable.values || [] // Initialize with all values
        }
      ]);
      setAvailableVariants(prev => prev.filter(v => v._id !== firstAvailable._id));
      setCount(prev => prev + 1);
    }
  };

  const handleVariantChange = (index, event) => {
    setCount(prev => prev + 1);
    const selectedId = event.target.value;
    const selectedVariant = availableVariants.find(v => v._id === selectedId);
    const oldVariantId = values.selectedVariants[index]._id;

    const newSelectedVariants = [...values.selectedVariants];
    newSelectedVariants[index] = {
      ...selectedVariant,
      value: selectedVariant.values || [] // Initialize with all possible values
    };

    setFieldValue('selectedVariants', newSelectedVariants);

    setAvailableVariants(prev => {
      let updated = [...prev];
      if (oldVariantId) {
        const oldVar = variants.find(v => v._id === oldVariantId);
        if (oldVar) updated.push(oldVar);
      }
      return updated.filter(v => v._id !== selectedId);
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
    const removedId = values.selectedVariants[index]._id;
    const newSelected = values.selectedVariants.filter((_, i) => i !== index);
    setFieldValue('selectedVariants', newSelected);
    if (removedId) {
      const removedObj = variants.find(v => v._id === removedId);
      if (removedObj) setAvailableVariants([...availableVariants, removedObj]);
    }
  };

  useEffect(() => {
    if (!isLoading && values.selectedVariants && values.selectedVariants.length > 0) {
      // Filter out variants that don't have values selected
      const validSelectedVariants = values.selectedVariants.filter(
        variant => variant.name && variant.value && variant.value.length > 0
      );

      if (validSelectedVariants.length === 0) return;

      const result = {
        names: validSelectedVariants.map(v => v.name),
        data: generateCombinations(validSelectedVariants) || []
      };

      if (isInitialized) {
        // Create a mapping of old variant structure to preserve data
        const oldVariantsMap = values.variants.reduce((acc, variant) => {
          acc[variant.name] = variant;
          return acc;
        }, {});

        // Preserve data based on index when possible, fallback to name matching
        setFieldValue('variants', result.data.map((newVariant, index) => {
          // First try to find by index (for similar structures)
          const existingVariantByIndex = values.variants[index];

          // Then try to find by exact name match
          const existingVariantByName = oldVariantsMap[newVariant.name];

          // Use index-based matching first, then fallback to name matching
          const existingVariant = existingVariantByIndex || existingVariantByName;

          if (existingVariant) {
            // Keep all existing data and update the structure
            return {
              ...existingVariant,
              name: newVariant.name,
              variant: result.names.join('/')
            };
          } else {
            // Create new variant with empty data
            return {
              ...newVariant,
              variant: result.names.join('/'),
              stockQuantity: '',
              sku: '',
              images: [],
              blob: [],
              price: '',
              salePrice: ''
            };
          }
        }));
      } else {
        // Initial load - map existing variants to the generated combinations
        setFieldValue('variants', result.data.map((v, i) => {
          const existingVariant = values.variants[i];
          return existingVariant ? {
            ...existingVariant,
            name: v.name,
            variant: result.names.join('/')
          } : {
            ...v,
            variant: result.names.join('/'),
            stockQuantity: '',
            sku: '',
            images: [],
            blob: [],
            price: '',
            salePrice: ''
          };
        }));
        setInitialized(true);
      }
    }
  }, [count, isLoading]);

  const isDigital = values.deliveryType === 'digital';

  return (
    <CardContent>
      <Stack gap={2}>
        {values.selectedVariants.map((variant, index) => (
          <Stack direction="row" spacing={2} alignItems="center" key={index}>
            <FormControl fullWidth>
              <Select
                value={variant.name || ''} // Changed from variant.name to variant._id
                onChange={e => handleVariantChange(index, e)}
                renderValue={(selected) => {
                  const selectedVariant = availableVariants.find(v => v._id === selected) || variant;
                  return selectedVariant.name;
                }}
              >
                {availableVariants.map(v => (
                  <MenuItem key={v._id} value={v._id}>{v.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {variant.name && (
              <FormControl fullWidth>
                <InputLabel>{`Values for ${variant.name}`}</InputLabel>
                <Select
                  multiple
                  value={variant.value || []}
                  onChange={e => handleVariantValueChange(index, e)}
                  input={<OutlinedInput label={`Values for ${variant.name}`} />}
                  renderValue={selected => selected.join(', ')}
                >
                  {/* Use the actual variant object's values, not searching by name */}
                  {(variant.values || []).map(value => (
                    <MenuItem key={value} value={value}>
                      <Checkbox checked={(variant.value || []).includes(value)} />
                      <ListItemText primary={value} />
                    </MenuItem>
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