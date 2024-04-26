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
import PayoutsListRow from 'src/components/table/rows/income';
// import IncomeListCard from 'src/components/cards/incomeList';

import PropTypes from 'prop-types';
// mui
import EditPaymentDialog from 'src/components/dialog/editPayment';
const TABLE_HEAD = [
  { id: 'name', label: 'Shop', alignRight: false },
  { id: 'items', label: 'Sale', alignRight: false, sort: true },
  { id: 'total', label: 'Total', alignRight: false, sort: true },
  { id: 'earning', label: 'Total Income', alignRight: false, sort: true },
  { id: 'commission', label: 'commission', alignRight: false, sort: true },
  { id: 'status', label: 'status', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Created', alignRight: false },
  { id: '', label: 'actions', alignRight: true }
];
export default function PayoutsList() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [payment, setPayment] = useState(null);
  const [count, setCount] = useState(0);
  const { data, isLoading: loadingList } = useQuery(
    ['payouts', pageParam, searchParam, count],
    () => api['getPayoutsByAdmin'](+pageParam || 1, searchParam || ''),
    {
      onError: (err) => toast.error(err.response.data.message || 'Something went wrong!')
    }
  );

  const isLoading = loadingList;
  return (
    <>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={PayoutsListRow}
        // mobileRow={IncomeListCard}
        handleClickOpen={(v) => setPayment(v)}
        isPayout
      />
      <EditPaymentDialog
        handleClose={(v) => setPayment(null)}
        open={Boolean(payment)}
        data={payment}
        setCount={setCount}
      />
    </>
  );
}
PayoutsList.propTypes = {
  isVendor: PropTypes.boolean
};
