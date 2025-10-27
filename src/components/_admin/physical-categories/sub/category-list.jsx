'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
// api
import * as api from 'src/services';
// useQuery
import { useQuery } from 'react-query';
// mui
import { Dialog } from '@mui/material';
// components
import DeletePhysicalDialog from 'src/components/dialog/deletePhysical';
import PhysicalTable from 'src/components/table/physicalTable';
import PhysicalSubCategoryRow from 'src/components/table/rows/physicalSubCategory';

const TABLE_HEAD = [
  { id: 'name', label: 'Subcategory' },
  { id: 'category', label: 'Category' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Date' },
  { id: '', label: 'Actions' }
];

export default function PhysicalSubCategoryList({ categories }) {
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  // ✅ Fetch subcategories
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['categories', apicall, searchParams.toString()],
    queryFn: () => api.getPhysicalSubCategoriesByAdmin(searchParams.toString())
  });

  // ✅ Delete dialog handlers
  const handleClickOpen = (prop) => () => {
    setId(prop);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth="xs">
        <DeletePhysicalDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint="deletePhysicalSubCategoryByAdmin"
          type="Physical Subcategory deleted"
          deleteMessage={
            'This subcategory is linked to products and child categories. Deleting it will also remove all related data. Are you sure you want to continue?'
          }
        />
      </Dialog>

      <PhysicalTable
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={PhysicalSubCategoryRow}
        handleClickOpen={handleClickOpen}
        isSearch
        filters={[
          { name: 'Category', param: 'category', data: categories },
          { ...STATUS_FILTER }
        ]}
      />
    </>
  );
}

const STATUS_FILTER = {
  name: 'Status',
  param: 'status',
  data: [
    { name: 'Active', slug: 'active' },
    { name: 'Inactive', slug: 'inactive' }
  ]
};
