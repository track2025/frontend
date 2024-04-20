import React, { useState, useCallback } from 'react';
// next
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { TextField, Stack } from '@mui/material';

const STATUS_OPTIONS = ['sale', 'new', 'regular', 'disabled'];

export default function ProductFilter({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selectedFilter, setSelectedFilter] = useState({
    category: searchParams.get('category') || categories[0].slug,
    status: searchParams.get('status') || STATUS_OPTIONS[0]
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setSelectedFilter({ ...selectedFilter, [name]: value });

    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set(name, value);
    router.push(`${pathname}?${updatedParams.toString()}`);

    console.log('Selected filter:', selectedFilter);
  };

  // const createQueryString = useCallback(
  //   (name, value) => {
  //     const params = new URLSearchParams(searchParams);
  //     params.set(name, value);
  //     return params.toString();
  //   },
  //   [searchParams]
  // );

  return (
    <>
      <Stack spacing={2} direction="row" alignItems="center">
        <TextField
          select
          size="small"
          placeholder="Category"
          value={selectedFilter.category}
          name="category" // Add name attribute
          SelectProps={{ native: true }}
          onChange={handleFilterChange}
        >
          {categories.map((option) => (
            <option key={option.slug} value={option.slug}>
              {option.name}
            </option>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          placeholder="Status"
          value={selectedFilter.status}
          name="status" // Add name attribute
          SelectProps={{ native: true }}
          onChange={handleFilterChange}
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
