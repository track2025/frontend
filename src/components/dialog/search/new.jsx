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
import { useRouter } from 'next/navigation';

export default function SimpleDialogDemo() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleRedirect = () => {
    router.push('/products?top=1');
  };

  return (
    <>
      <Link
        onClick={handleRedirect}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          cursor: "pointer",
          color: "primary.dark",
          textDecoration: "none",
          fontWeight: "500",
          "& svg": {
            fontSize: 20,
            color: "primary.dark",
            fontWeight: 500,
          },
          "&:hover": { textDecoration: "underline" },
        }}
      >
        <RxMagnifyingGlass />
        Search...
      </Link>

      {/* <Dialog open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: 600 } }}>
        <Search onClose={handleClose} />
      </Dialog> */}
    </>
  );
}
