'use client';
import React from 'react';
import * as Yup from 'yup';
// mui
import { FormControl, InputAdornment, TextField, Button } from '@mui/material';
// react
import { useMutation } from 'react-query';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
import Stack from '@mui/material/Stack';
// api
import * as api from 'src/services';
// toast
import { toast } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';

// icons
import { BsFillSendFill } from 'react-icons/bs';

export default function NewsLetter() {
  const [loading, setloading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    onSubmit: async (values) => {
      if (
        values.email
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
      ) {
        setloading(true);
        mutate(values);
      } else {
        toast.error('Invalid email!');
      }
    }
  });

  const { mutate } = useMutation(api.sendNewsletter, {
    onSuccess: (data) => {
      toast.success(data.message);
      setloading(false);
      formik.resetForm();
    },
    onError: (err) => {
      setloading(false);
      toast.error(err.response.data.message);
    }
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Stack sx={{}} direction="row" alignItems="center" spacing={2}>
          <FormControl fullWidth variant="outlined">
            <TextField
              size="medium"
              placeholder="Enter your Email"
              {...getFieldProps('email')}
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: (theme) => theme.palette.background.paper,
                  input: {
                    paddingY: '9.5px !important'
                  }
                }
              }}
            />
          </FormControl>
          <LoadingButton
            variant="contained"
            size="medium"
            color="primary"
            type="submit"
            loading={loading}
            sx={{ marginTop: 8, paddingX: 4 }}
          >
            Subscribe
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
