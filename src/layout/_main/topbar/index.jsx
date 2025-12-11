import React from 'react';

// mui
import { Toolbar, Container, Stack, Typography } from '@mui/material';

// components
import TopbarClient from './TopbarClient';

// icons
import { MdOutlinePhone } from 'react-icons/md';
import { MdOutlineMail } from 'react-icons/md';

export default function UserTopbar() {
  return (
    <Container maxWidth="xl">
      <Toolbar
        sx={{
          minHeight: `36px !important`,
          justifyContent: 'space-between',
          display: { xs: 'none', md: 'flex' },
          position: 'sticky',
          zIndex: 999,
          width: '100% !important',
          px: '0px!important',
          mx: '0px !important',
          left: '0px !important'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography sx={{ color: 'text.primary', fontSize: 14, display: 'flex', alignItems: 'center', gap: 1 }}>
            Welcome to Lap Snaps. high-quality photographs of vehicles
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TopbarClient />
        </Stack>
      </Toolbar>
    </Container>
  );
}
