import React from 'react';
// mui
import { Box, Typography } from '@mui/material';
import CompareTable from 'src/components/table/compareTable';

export default function Compare() {
  return (
    <Box mt={{ md: 5, xs: 3 }}>
      <Typography variant="h3" color="text.primary">
        Compare Product
      </Typography>
      <Box mt={{ md: 5, xs: 3 }} pb={14}>
        <CompareTable />
      </Box>
    </Box>
  );
}
