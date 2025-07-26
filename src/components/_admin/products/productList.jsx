'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

// mui
import { Dialog, Stack } from '@mui/material';
import DeleteDialog from 'src/components/dialog/delete';
// components
import Table from 'src/components/table/table';
import Product from 'src/components/table/rows/product';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

const TABLE_HEAD = [
  { id: 'name', label: 'Product', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
  { id: 'rating', label: 'Rating', alignRight: false, sort: true },
  { id: 'price', label: 'Price', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];
export default function AdminProducts({ brands, categories, shops, isVendor }) {
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);
  const { data, isLoading } = useQuery(
    ['admin-products', apicall, searchParams.toString()],
    () => api[isVendor ? 'getVendorProducts' : 'getProductsByAdmin'](searchParams.toString()),
    {
      onError: (err) => toast.error(err.response.data.message || 'Something went wrong!')
    }
  );

  const handleClickOpen = (prop) => () => {
    setId(prop);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'xs'}>
        <DeleteDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint={isVendor ? 'deleteVendorProduct' : 'deleteProductByAdmin'}
          type={'Product deleted'}
          deleteMessage={
            'Are you really sure you want to remove this product? Just making sure before we go ahead with it.'
          }
        />
      </Dialog>
      <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        {}
      </Stack>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={Product}
        handleClickOpen={handleClickOpen}
        brands={isVendor ? [] : brands}
        categories={isVendor ? [] : categories}
        isVendor={isVendor}
        filters={
          isVendor
            ? []
            : [
                {
                  name: 'Photographer',
                  param: 'photographer',
                  data: shops
                },
                {
                  name: 'Vehicle Make',
                  param: 'vehicle-makes',
                  data: categories
                },
                {
                  name: 'Location',
                  param: 'location',
                  data: brands
                }
              ]
        }
        isSearch
      />
    </>
  );
}
AdminProducts.propTypes = {
  brands: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  isVendor: PropTypes.boolean
};
