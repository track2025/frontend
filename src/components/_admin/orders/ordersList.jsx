'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
// toast
import toast from 'react-hot-toast';
// components
import Table from 'src/components/table/table';
import OrderList from 'src/components/table/rows/orderList';
import OrderListCard from 'src/components/cards/OrderList';
import DeleteDialog from 'src/components/dialog/delete';
import PropTypes from 'prop-types';
// mui
import { Dialog } from '@mui/material';
const TABLE_HEAD = [
  { id: 'name', label: 'User', alignRight: false },
  { id: 'total', label: 'Total', alignRight: false, sort: true },
  { id: 'items', label: 'items', alignRight: false },
  { id: 'inventoryType', label: 'status', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
  { id: '', label: 'actions', alignRight: true }
];
export default function OrdersAdminList({ isVendor }) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [apicall, setApicall] = useState(false);
  const { data, isLoading: loadingList } = useQuery(
    ['orders', apicall, pageParam, searchParam],
    () => api[isVendor ? 'getOrdersByVendor' : 'getOrdersByAdmin'](+pageParam || 1, searchParam || ''),
    {
      onError: (err) => toast.error(err.response.data.message || 'Something went wrong!')
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
          endPoint="deleteOrder"
          type={'Order deleted'}
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={OrderList}
        mobileRow={OrderListCard}
        handleClickOpen={handleClickOpen}
        isVendor={isVendor}
      />
    </>
  );
}
OrdersAdminList.propTypes = {
  isVendor: PropTypes.boolean
};
