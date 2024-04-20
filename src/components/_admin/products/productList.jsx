'use client';
import React, { useState } from 'react';
// toast
import toast from 'react-hot-toast';
// api
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
// mui
import { Dialog, Stack } from '@mui/material';
import DeleteDialog from 'src/components/dialog/delete';
import Table from 'src/components/table/table';
import ProductCard from 'src/components/cards/adminProduct';
import Product from 'src/components/table/rows/product';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import Search from 'src/components/search';
import ProductFilter from './productFilter';

const TABLE_HEAD = [
  { id: 'name', label: 'Product', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
  { id: 'inventoryType', label: 'Status', alignRight: false, sort: false },
  { id: 'rating', label: 'Rating', alignRight: false, sort: true },
  { id: 'price', label: 'Price', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];
export default function AdminProducts({ brands, categories, isVendor }) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const categoryParam = searchParams.get('category');
  const statusParam = searchParams.get('status');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);
  const { data, isLoading } = useQuery(
    ['admin-products', apicall, searchParam, pageParam, categoryParam, statusParam],
    () =>
      api[isVendor ? 'getVendorProducts' : 'getAdminProducts'](
        +pageParam || 1,
        searchParam || '',
        statusParam || '',
        categoryParam || ''
      ),
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
          endPoint={isVendor ? 'deleteVendorProduct' : 'deleteProduct'}
          type={'Product deleted'}
          deleteMessage={
            'Are you really sure you want to remove this product? Just making sure before we go ahead with it.'
          }
        />
      </Dialog>
      <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Search />
        <ProductFilter categories={categories} />
      </Stack>
      <Table
        headData={TABLE_HEAD}
        data={data}
        mobileRow={ProductCard}
        isLoading={isLoading}
        row={Product}
        handleClickOpen={handleClickOpen}
        brands={brands}
        categories={categories}
      />
    </>
  );
}
AdminProducts.propTypes = {
  brands: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  isVendor: PropTypes.boolean
};
