'use client';
import React from 'react';
import PropTypes from 'prop-types';

// mui
import { Card, Box, Typography, IconButton, Divider } from '@mui/material';
// icons
import { MdClear } from 'react-icons/md';

// components
import PhysicalBrandFilter from './brands';
import PhysicalColorFilter from './colors';
import PhysicalSizeFilter from './others';
import PhysicalPriceRange from './price';


PhysicalFilter.propTypes = {
  onClose: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  data: PropTypes.array
};

export default function PhysicalFilter({ ...props }) {
  const { onClose, pathname, filters } = props;

  const colors = filters?.attributes.find((item) => {
    const name = item?.name?.toLowerCase();
    return name === 'color' || name === 'colors';
  });

  const restVariants = filters?.attributes.filter((item) => {
    const name = item?.name?.toLowerCase();
    return name !== 'color' && name !== 'colors';
  });
  return (
    <Card sx={{ width: '300px', border: 'none !important', borderRadius: '0px !important' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography variant="h5" color="text.primary">
          Filter
        </Typography>

        <IconButton onClick={() => onClose()}>
          <MdClear />
        </IconButton>
      </Box>
      <Box sx={{ height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
        {Boolean(filters?.brands?.length) && (
          <Box p={2}>
            <PhysicalBrandFilter brands={filters?.brands} path={pathname} />
          </Box>
        )}
        {Boolean(colors?.values) && (
          <>
            <Divider />
            <Box p={2}>
              <PhysicalColorFilter colors={colors.values} keyName={colors.name} path={pathname} />
            </Box>
          </>
        )}
        {restVariants.map((filter) => (
          <React.Fragment key={filter.name}>
            <Divider />
            <Box p={2}>
              <PhysicalSizeFilter values={filter?.values} path={pathname} keyName={filter.name} />
            </Box>
          </React.Fragment>
        ))}
        <Divider />
        <Box p={2}>
          <PhysicalPriceRange prices={filters?.prices} path={pathname} />
        </Box>
      </Box>
    </Card>
  );
}
