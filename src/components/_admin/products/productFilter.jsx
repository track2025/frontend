'use client';
import React, { useState, useCallback } from 'react';
// next
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { TextField, Button, Popover, Stack } from '@mui/material';

const STATUS_OPTIONS = ['sale', 'new', 'regular', 'disabled'];

export default function ProductFilter({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const filterParam = searchParams.get('filter');
  console.log(categories, 'categories');
  // filter
  const [selectedfilter, setSelectedfilter] = useState(filterParam || STATUS_OPTIONS[0]);

  const handlefilterChange = (event) => {
    setSelectedfilter(event.target.value);
    router.push(`${pathname}?${createQueryString('filter', event.target.value)}`);
    console.log('Selected filter:', event.target.value);
  };

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  return (
    <>
      <Stack spacing={2} direction="row" alignItems="center">
        <TextField
          select
          size="small"
          placeholder="filter"
          value={selectedfilter}
          SelectProps={{ native: true }}
          onChange={handlefilterChange}
        >
          {categories.map((option) => (
            <option key={option} value={option.slug}>
              {option.name}
            </option>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          placeholder="filter"
          value={selectedfilter}
          SelectProps={{ native: true }}
          onChange={handlefilterChange}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </TextField>
      </Stack>
    </>
  );
}
