'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
// api
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
// mui
import { Dialog } from '@mui/material';
// components
import DeletePhysicalDialog from 'src/components/dialog/deletePhysical';
import PhysicalBrandsRow from 'src/components/table/rows/physicalBrand';

import Table from 'src/components/table/table';

const TABLE_HEAD = [
  { id: 'name', label: 'Brands' },
  { id: 'description', label: 'Description' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Date' },
  { id: '', label: 'Actions' }
];

export default function BrandList() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['physical-brands', apicall, searchParam, pageParam],
    queryFn: () => api.getPhysicalBrandsByAdmin(+pageParam || 1, searchParam || '')
  });

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
        <DeletePhysicalDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint="deletePhysicalBrandByAdmin"
          type={'Physical Brand deleted'}
          deleteMessage={
            'This brand is linked to products. Deleting it will also remove all related data. Are you sure you want to continue?'
          }
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={PhysicalBrandsRow}
        handleClickOpen={handleClickOpen}
        isSearch
        filters={[{ ...STATUS_FILTER }]}
      />
    </>
  );
}
const STATUS_FILTER = {
  name: 'Status',
  param: 'status',
  data: [
    {
      name: 'Active',
      slug: 'active'
    },
    {
      name: 'Inactive',
      slug: 'inactive'
    }
  ]
};
