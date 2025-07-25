import * as React from 'react';
// icons
import { IoSearchOutline } from 'react-icons/io5';
// mui
import { Dialog, Typography } from '@mui/material';
import { Link, Stack, Button, alpha, Box, Skeleton } from '@mui/material';

import IconButton from '@mui/material/IconButton';
// components
import Search from './search';
import { RxMagnifyingGlass } from 'react-icons/rx';

export default function SimpleDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
      className='border border-1'
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        onClick={handleClickOpen}
        variant="contained"
        size="large"
        sx={{
          boxShadow: 'none',
          borderRadius: 10,
          width: 150,
          bgcolor: (theme) => alpha(theme.palette.common.black, 0.1),
          color: 'text.primary'
        }}
        startIcon={<RxMagnifyingGlass sx={{ color: 'text.primary' }} />}
      >    

          Search...
      </Button>

      <Dialog open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: 600 } }}>
        <Search onClose={handleClose} />
      </Dialog>
    </>
  );
}
