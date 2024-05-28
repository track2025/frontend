import React from 'react';
// mui
import { Box, Button, Typography } from '@mui/material';
// svg
import NotFoundSVG from 'src/assets/notFoundSVG';

export default function NotFound() {
  return (
    <Box
      spacing={3}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 3 }}
    >
      <NotFoundSVG />
      <Typography variant="h4" color="text.primary">
        404, Page not founds
      </Typography>
      <Typography variant="body1" color="initial">
        Something went wrong. It’s look that your requested could not be found. It’s look like the link is broken or the
        page is removed.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" size="large">
          Go Back
        </Button>
        <Button variant="outlined" color="primary" size="large">
          Go To Home
        </Button>
      </Box>
    </Box>
  );
}
