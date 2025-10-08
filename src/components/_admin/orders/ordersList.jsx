'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
// components
import Table from 'src/components/table/table';
import OrderList from 'src/components/table/rows/orderList';
import DeleteDialog from 'src/components/dialog/delete';
import PropTypes from 'prop-types';
// mui
import { Dialog } from '@mui/material';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
const TABLE_HEAD = [
  { id: 'name', label: 'User', alignRight: false },
  { id: 'total', label: 'Total', alignRight: false, sort: true },
  { id: 'items', label: 'items', alignRight: false },
  { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
  { id: '', label: 'actions', alignRight: true }
];
export default function OrdersAdminList({ isVendor, shops, searchBy }) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  if (searchBy) {
    params.set(searchBy.key, searchBy.value);
  }

  const [apicall, setApicall] = useState(false);
  const { data, isLoading: loadingList } = useQuery(
    ['orders', apicall, params.toString()],
    () => api[isVendor ? 'getOrdersByVendor' : 'getOrdersByAdmin'](params.toString()),
    {
      onError: (err) =>
        toast.error(err.response.data.message || 'We ran into an issue. Please refresh the page or try again.')
    }
  );
  const [open, setOpen] = useState(false);

  const [id, setId] = useState(null);

  const handleClickOpen = (props) => () => {
    setId(props);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isLoading = loadingList;
  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'xs'}>
        <DeleteDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint="deleteOrderByAdmin"
          type={'Order deleted'}
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={OrderList}
        handleClickOpen={handleClickOpen}
        isVendor={isVendor}
        isSearch
        filters={
          isVendor || searchBy
            ? []
            : [
                {
                  name: 'Photographers',
                  param: 'shop',
                  data: shops
                }
              ]
        }
      />
    </>
  );
}
OrdersAdminList.propTypes = {
  isVendor: PropTypes.boolean
};
