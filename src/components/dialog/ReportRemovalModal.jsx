'use client';
import { useState, useRef } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Box,
  Divider
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import LoadingButton from '@mui/lab/LoadingButton';

import * as api from 'src/services';
import { useMutation } from 'react-query';
import ReCAPTCHA from 'react-google-recaptcha';



const ReportRemovalModal = ({ open, onClose, product }) => {
  const [submitting, setSubmitting] = useState(false);
  const recaptchaRef = useRef(null);
  const [recaptchaValue, setRecaptchaValue] = useState(null);


  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string(),
    reason: Yup.string().required('Please select a reason'),
    details: Yup.string().required('Please provide details'),
   // recaptcha: Yup.string().required('Please verify you are not a robot')

  });

   const { mutate, isLoading } = useMutation(api['requestRemoval'], {
      onSuccess: () => {
        toast.success('Removal request submitted successfully! Please note that submitting another removal request will invalidate all your previous requests.');
      },
      onError: () => {
        toast.error('We ran into an issue. Please refresh the page or try again.');
      }
    });

  const handleSubmit = async (values, { resetForm }) => {
    setSubmitting(true);
    
    try {

      const token = recaptchaValue;
      if (!token) {
        throw new Error('Please complete the reCAPTCHA');
      }

      const verification = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      const { success } = await verification.json();
      
      if (!success) {
        throw new Error('reCAPTCHA verification failed');
      }
      
      if (!success) {
        throw new Error('reCAPTCHA verification failed');
      }
      

      const reportData = {
        ...values,
        recaptchaToken: token,
        productId: product._id,
        productName: product.name,
        productUrl: typeof window !== 'undefined' ? window.location.href : '',
        productImage: product.cover?.url,
        reportedAt: new Date().toISOString()
      };

      

      const { ...rest } = values;
      await mutate({ ...reportData });
      resetForm();
      recaptchaRef.current.reset();
      setRecaptchaValue(null);
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit removal request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Request Picture Removal</Typography>
        <Typography variant="body2" color="text.secondary">
          Please provide details about why this image should be removed
        </Typography>
      </DialogTitle>
      
      <Divider />
      
      <Formik
        initialValues={{
          name: '',
          email: '',
          phone: '',
          reason: '',
          details: '',
          recaptcha: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Your Name *"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  margin="normal"
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="Email *"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  margin="normal"
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  variant="outlined"
                />
                
                <FormControl fullWidth margin="normal" error={touched.reason && Boolean(errors.reason)}>
                  <InputLabel>Reason for Removal *</InputLabel>
                  <Select
                    name="reason"
                    value={values.reason}
                    label="Reason for Removal *"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <MenuItem value=""><em>Select a reason</em></MenuItem>
                    <MenuItem value="copyright">Copyright violation</MenuItem>
                    <MenuItem value="privacy">Privacy concerns</MenuItem>
                    <MenuItem value="inappropriate">Inappropriate content</MenuItem>
                    <MenuItem value="trademark">Trademark violation</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {touched.reason && errors.reason && (
                    <FormHelperText>{errors.reason}</FormHelperText>
                  )}
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Additional Details *"
                  name="details"
                  value={values.details}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.details && Boolean(errors.details)}
                  helperText={touched.details && errors.details}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </Box>
            

            <Box sx={{ mt: 2 }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  onChange={handleRecaptchaChange}
                />
                {!recaptchaValue && touched.recaptcha && (
                  <FormHelperText error>Please verify you are not a robot</FormHelperText>
                )}
              </Box>
              </DialogContent>
            
            <Divider />

            
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={onClose} color="inherit" disabled={submitting}>
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                color="error"
                variant="contained"
                loading={submitting}
                disabled={submitting}
              >
                Submit Request
              </LoadingButton>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ReportRemovalModal;