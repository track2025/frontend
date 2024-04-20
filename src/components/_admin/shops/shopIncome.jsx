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
import IncomeList from 'src/components/table/rows/income';
import IncomeListCard from 'src/components/cards/incomeList';
import DeleteDialog from 'src/components/dialog/delete';
import PropTypes from 'prop-types';
// mui
import { Dialog, Typography } from '@mui/material';
const TABLE_HEAD = [
  { id: 'name', label: 'Shop', alignRight: false },
  { id: 'items', label: 'items', alignRight: false, sort: true },
  { id: 'total', label: 'Amount', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Created', alignRight: false },
  { id: 'commission', label: 'commission', alignRight: false, sort: true },
  { id: 'payment', label: 'payment method', alignRight: false, sort: true },
  { id: 'status', label: 'status', alignRight: false, sort: true },
  { id: '', label: 'actions', alignRight: true }
];
export default function ShopIcomeList({ isVendor }) {
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
      <Typography variant="h5" color="text.primary" my={2}>
        Income
      </Typography>
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
        row={IncomeList}
        mobileRow={IncomeListCard}
        handleClickOpen={handleClickOpen}
      />
    </>
  );
}
ShopIcomeList.propTypes = {
  isVendor: PropTypes.boolean
};
