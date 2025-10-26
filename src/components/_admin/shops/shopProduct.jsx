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

import Product from 'src/components/table/rows/product';

// mui
import { Typography } from '@mui/material';
import ProductList from 'src/components/_admin/products/productList';

export default function ShopProductList({ slug, onUpdatePayment, isVendor }) {
  return (
    <>
      <Typography variant="h5" color="text.primary" my={2}>
        My Media
      </Typography>

      <ProductList categories={null} shops={null} brands={null} searchBy={{ key: 'photographer', value: slug }} />
    </>
  );
}
ShopProductList.propTypes = {
  slug: PropTypes.string
};
