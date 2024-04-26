import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// react
import { useMutation } from 'react-query';
// api
import * as api from 'src/services';
// toast
import toast from 'react-hot-toast';

export default function FormDialog({ open, handleClose, data, setCount }) {
  const [status, setStatus] = useState(data?.status || 'pending');

  const { mutate, isLoading } = useMutation(api[data?._id ? 'editPayment' : 'createPayment'], {
    onSuccess: () => {
      toast.success('updated');
      setCount((prev) => prev + 1);
      handleClose();
    },
    onError: () => {
      toast.error('Something went wrong!');
    }
  });
  useEffect(() => {
    setStatus(data?.status);
  }, [data]);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={() => handleClose()}
        PaperProps={{
          component: 'form',
          onSubmit: async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            console.log(formJson);
            await mutate({
              ...formJson,
              shop: data.shop,
              orders: data.orders,
              date: data?.date,
              pid: data?._id || null
            });
          }
        }}
      >
        <DialogTitle>Edit Payment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates occasionally.
          </DialogContentText>

          <Stack gap={2} mt={4}>
            <Stack gap={2} direction="row">
              <TextField
                autoFocus
                required
                id="total"
                name="total"
                label="Total"
                type="number"
                fullWidth
                variant="outlined"
                defaultValue={data?.total}
              />

              <TextField
                required
                id="totalIncome"
                name="totalIncome"
                label="Total Income"
                type="number"
                fullWidth
                variant="outlined"
                defaultValue={data?.totalIncome}
              />
            </Stack>
            <Stack gap={2} direction="row">
              <TextField
                required
                id="totalCommission"
                name="totalCommission"
                label="Total Commission"
                type="number"
                fullWidth
                variant="outlined"
                defaultValue={data?.totalCommission}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  label="Status"
                  name="status"
                  id="status"
                  defaultValue={data?.status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="hold">Hold</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            {status === 'paid' && (
              <Stack gap={2} direction="row">
                <TextField
                  required
                  id="paidAt"
                  name="paidAt"
                  label="Paid At"
                  type="date"
                  fullWidth
                  variant="outlined"
                  defaultValue={data?.paidAt}
                />

                <TextField
                  id="tip"
                  name="tip"
                  label="Tip to pay vendor"
                  type="number"
                  fullWidth
                  variant="outlined"
                  defaultValue={data?.tip}
                />
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
