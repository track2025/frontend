'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
// components
import Table from 'src/components/table/table';

import OrdersList from 'src/components/_admin/orders/ordersList';

// mui
import { Typography } from '@mui/material';

export default function ShopOrderList({ slug, onUpdatePayment, isVendor }) {
  return (
    <>
      <Typography variant="h5" color="text.primary" my={2}>
        My Order
      </Typography>

      <OrdersList shops={null} searchBy={{ key: 'shop', value: slug }} />
    </>
  );
}
ShopOrderList.propTypes = {
  slug: PropTypes.string
};
