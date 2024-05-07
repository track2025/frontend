import React from 'react';
import { GoGitCompare } from 'react-icons/go';
import { IconButton, Badge, alpha, Stack, Typography } from '@mui/material';

export default function wishlistWidget() {
  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        width="auto"
        sx={{
          cursor: 'pointer'
        }}
      >
        <IconButton
          aria-label="compare"
          color="primary"
          disableRipple
          sx={{
            borderColor: 'primary',
            borderWidth: 1,
            borderStyle: 'solid',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2)
          }}
        >
          <GoGitCompare />
        </IconButton>
        <Stack>
          <Typography variant="subtitle2" color="text.primary" mb={-0.6}>
            Compare
          </Typography>
          <Typography variant="body1" color="text.secondary">
            3 Items
          </Typography>
        </Stack>
      </Stack>
    </>
  );
}
