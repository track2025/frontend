import React from 'react';
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';
// mui
import { Grid, Paper, Typography, Skeleton, Box, Stack, Link, IconButton, Tooltip } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IoEye } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';

// components
import Label from 'src/components/label';
// utils
import { fDateShort } from 'src/utils/formatTime';
import { fCurrency } from 'src/utils/formatNumber';
// lodash
import { capitalize } from 'lodash';
// next
import NextLink from 'next/link';

const RootStyle = styled(Paper)(({ theme }) => ({
  padding: '10px 10px 10px 16px',
  marginBottom: '0.5rem',
  backgroundColor: theme.palette.background.paper,
  border: '1px solid ' + theme.palette.divider,
  borderRadius: 4,
  '& .name': {
    fontWeight: 600,
    color: theme.palette.text.primary
  },
  '& .time svg': {
    width: 10,
    height: 10,
    '& path': {
      fill: theme.palette.text.primary
    }
  },
  '& .date': {
    fontSize: '0.75rem',
    fontWeight: 500
  },
  '& .callander': {
    '& svg': {
      width: 10,
      height: 10
    }
  },
  '& .time-slot': {
    fontWeight: 500,
    fontSize: '0.75rem'
  },
  '& .phone-container': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    gap: '0.5rem',
    '& .phone': {
      color: theme.palette.text.secondary,
      fontWeight: 400,
      fontSize: 11
    },
    '& .btn-phone': {
      fontSize: '1px'
    }
  }
}));

export default function IncomeListData({ item, isLoading, isUser, handleClickOpen }) {
  const theme = useTheme();

  return (
    <RootStyle key={uniqueId()}>
      <Grid container alignItems="center">
        <Grid item md={8} sm={8} xs={8}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack spacing={0.5}>
              <Link className="name" component={NextLink} href={`/orders/${item?._id}`} underline="none">
                {isLoading ? <Skeleton variant="text" /> : `Sales: ${item.orders?.length || 0}`}
              </Link>
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography className="time-slot">
                  {isLoading ? <Skeleton variant="text" width={50} /> : `Total Income: ${fCurrency(item.totalIncome)}`}
                </Typography>
                <Typography className="date">
                  {isLoading ? (
                    <Skeleton variant="text" width={50} />
                  ) : (
                    `Commission: ${fCurrency(item.totalCommission)}`
                  )}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Typography sx={{ textAlign: 'right', mb: 0.5 }} variant="body2" fontWeight={600}>
            {isLoading ? <Skeleton variant="text" width={50} sx={{ ml: 'auto' }} /> : fCurrency(Number(item?.total))}
          </Typography>
          <Box className="phone-container">
            {isLoading ? (
              <Skeleton variant="text" width={50} />
            ) : (
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={
                  (item?.status === 'delivered' && 'success') ||
                  (item?.status === 'ontheway' && 'warning') ||
                  (item?.status === 'pending' && 'info') ||
                  'error'
                }
              >
                {capitalize(item?.status)}
              </Label>
            )}
            {isLoading ? (
              <Skeleton variant="circular" width={34} height={34} />
            ) : (
              <IconButton size="small" onClick={() => router.push(`/admin/payments/${item._id}`)}>
                <IoEye />
              </IconButton>
            )}
            {isLoading ? (
              <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            ) : item?.thisMonth ? null : (
              <IconButton size="small" onClick={() => handleClickOpen(item)}>
                <MdEdit />
              </IconButton>
            )}
          </Box>
        </Grid>
      </Grid>
    </RootStyle>
  );
}
IncomeListData.propTypes = {
  item: PropTypes.object,
  isLoading: PropTypes.bool,
  isUser: PropTypes.bool
};
