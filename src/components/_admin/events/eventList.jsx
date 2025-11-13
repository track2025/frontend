'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
// api
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
// mui
import { Dialog } from '@mui/material';
// components
import DeleteDialog from 'src/components/dialog/delete';
import Table from 'src/components/table/table';
import Event from 'src/components/table/rows/event';

const TABLE_HEAD = [
  { id: 'name', label: 'Brands', alignRight: false, sort: true },
  // { id: 'type', label: 'Type', alignRight: false },
  { id: 'startTime', label: 'Start Time', alignRight: false },
  { id: 'endTime', label: 'End Time', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'status', label: 'Active Status', alignRight: false },
  { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];

export default function EventList() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isLoading, error } = useQuery(
    ['events', apicall, searchParams?.toString()],
    () => api.getEventsByAdmin(searchParams?.toString() || ''),
    {
      onError: (err) => toast.error(err.message || 'We ran into an issue. Please refresh the page or try again.')
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
          endPoint="deleteEventByAdmin"
          type={'Record deleted'}
          deleteMessage={
            'Are you sure you want to delete this event? Please consider carefully before making irreversible changes.'
          }
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={error ? [] : data}
        isLoading={isLoading}
        row={Event}
        handleClickOpen={handleClickOpen}
        isSearch
      />
    </>
  );
}
