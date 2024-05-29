'use client';
import React, { useState } from 'react';

// toast
import toast from 'react-hot-toast';
// api
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
// mui
import { Dialog } from '@mui/material';
import DeleteDialog from 'src/components/dialog/delete';
import Table from 'src/components/table/table';
import ShopCard from 'src/components/cards/shopx';
import Shop from 'src/components/table/rows/shop';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';

const TABLE_HEAD = [
  { id: 'name', label: 'Shop', alignRight: false, sort: true },
  { id: 'owner', label: 'Owner', alignRight: false, sort: true },
  { id: 'products', label: 'products', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: false },
  { id: '', label: 'Actions', alignRight: true }
];

export default function AdminProducts({ isVendor }) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isLoading } = useQuery(
    ['admin-shops', apicall, searchParam, pageParam],
    () => api.getShopsByAdmin(+pageParam || 1, searchParam || ''),
    {
      onError: (err) => toast.error(err.response.data.message || 'Something went wrong!')
    }
  );
  console.log(data, 'data123');
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
      <Table
        headData={TABLE_HEAD}
        data={data}
        mobileRow={ShopCard}
        isLoading={isLoading}
        row={Shop}
        handleClickOpen={handleClickOpen}
        isSearch
      />
    </>
  );
}
AdminProducts.propTypes = {
  isVendor: PropTypes.boolean
};
