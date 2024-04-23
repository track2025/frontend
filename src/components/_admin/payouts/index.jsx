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
import PayoutsListRow from 'src/components/table/rows/payouts';
// import IncomeListCard from 'src/components/cards/incomeList';
import DeleteDialog from 'src/components/dialog/delete';
import PropTypes from 'prop-types';
// mui
import { Dialog } from '@mui/material';
const TABLE_HEAD = [
  //   { id: 'name', label: 'Shop', alignRight: false },
  { id: 'items', label: 'Sale', alignRight: false, sort: true },
  { id: 'earning', label: 'Total Income', alignRight: false, sort: true },
  { id: 'commission', label: 'commission', alignRight: false, sort: true },

  { id: 'status', label: 'status', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Created', alignRight: false },
  { id: '', label: 'actions', alignRight: true }
];
export default function PayoutsList({ IncomeData }) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [apicall, setApicall] = useState(false);
  const { data, isLoading: loadingList } = useQuery(
    ['payouts', apicall, pageParam, searchParam],
    () => api['getPayoutsByAdmin'](+pageParam || 1, searchParam || ''),
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
  console.log(data, 'getPayoutsByAdmin');
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
        row={PayoutsListRow}
        // mobileRow={IncomeListCard}
        handleClickOpen={handleClickOpen}
      />
    </>
  );
}
PayoutsList.propTypes = {
  isVendor: PropTypes.boolean
};
