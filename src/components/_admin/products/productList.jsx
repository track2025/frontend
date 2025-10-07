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
export default function AdminProducts({ brands, categories, shops, isVendor, searchBy }) {
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams);

  // always set searchBy (replace if exists, add if not)
  if (searchBy) {
    params.set(searchBy.key, searchBy.value);
  }

  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const { data, isLoading } = useQuery(
    ['admin-products', apicall, params.toString()],
    () => api[isVendor ? 'getVendorProducts' : 'getProductsByAdmin'](params.toString()),
    {
      onError: (err) =>
        toast.error(
          err?.message || err?.response?.data?.message || 'We ran into an issue. Please refresh the page or try again.'
        )
    }
  );

  const handleClickOpen = (prop, deleteType) => () => {
    if (deleteType === 'singleDelete') {
      setSelectedRows([]);
      setId(prop);
      setOpen(true);
    } else if (deleteType === 'multipleDelete') {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRows([]);
  };

  function UpdateSelectedRow(id, type, checkType) {
    if (type === 'single') {
      setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    } else if (type === 'all') {
      if (checkType) {
        // ✅ Select all IDs
        const allIds = data?.data?.map((item) => item._id) || [];
        setSelectedRows(allIds);
      } else {
        // ✅ Deselect all
        setSelectedRows([]);
      }
    }
  }

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
          selectedRows={selectedRows}
        />
      </Dialog>
      <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        {}
      </Stack>

      <Table
        headData={TABLE_HEAD}
        data={data ?? { success: true, data: [], total: 0, count: 0, currentPage: 1 }}
        isLoading={isLoading}
        row={Product}
        UpdateSelectedRow={UpdateSelectedRow}
        selectedRows={selectedRows}
        handleClickOpen={handleClickOpen}
        brands={isVendor ? [] : brands}
        categories={isVendor ? [] : categories}
        isVendor={isVendor}
        filters={
          isVendor || searchBy
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
        isSearch={!searchBy ? true : false}
        bulkAction={[
          {
            actionName: 'Delete',
            action: handleClickOpen(null, 'multipleDelete')
          }
        ]}
      />
    </>
  );
}
AdminProducts.propTypes = {
  brands: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  isVendor: PropTypes.bool
};
