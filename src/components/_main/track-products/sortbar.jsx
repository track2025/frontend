'use client';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { isString } from 'lodash';
import { Stack, Drawer, Typography, Skeleton, Button, MenuItem, FormControl, Select, Paper } from '@mui/material';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import { MdTune } from 'react-icons/md';
import PhysicalFilter from './filters';

export default function SortBar({ productData, isLoading, sortData, filters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [itemsPerPage, setItemsPerPage] = useState('12');
  const [state, setState] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  // Helper to update query param in URL
  const updateQuery = useCallback((params) => {
    const query = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.set(key, value);
      else query.delete(key);
    });
    router.push(`${pathname}?${query.toString()}`, 'isPathname');
  }, [router, pathname, searchParams]);

  // Handle sort change
  const handleSortChange = (event) => {
    const selected = sortData.find(item => item.title === event.target.value);
    if (!selected) return;
    const currentKey = state ? sortData.find(item => item.title === state)?.key : null;
    updateQuery({ [selected.key]: selected.value, [currentKey]: undefined });
    setState(selected.title);
  };

  // Handle items per page
  const handleItemsPerPageChange = (event) => {
    const limit = event.target.value;
    setItemsPerPage(limit);
    updateQuery({ limit });
  };

  // Sync state with URL
  useEffect(() => {
    setItemsPerPage(isString(searchParams.get('limit')) ? searchParams.get('limit') : '12');

    // Determine sort state
    const top = searchParams.get('top');
    const name = searchParams.get('name');
    const date = searchParams.get('date');
    const price = searchParams.get('price');

    setState(
      top === '-1' ? 'Top Rated' :
        name === '1' ? 'Asceding' :
          name === '-1' ? 'Desceding' :
            date === '1' ? 'Oldest' :
              date === '-1' ? 'Newest' :
                price === '1' ? 'Price low to high' :
                  price === '-1' ? 'Price high to low' :
                    'Top Rated'
    );
  }, [searchParams]);

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: 'white' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
        <Typography variant="body2" color="text.secondary">
          {isLoading ? <Skeleton variant="text" width={150} /> :
            productData?.total ? (
              `Showing ${searchParams.get('page') ? (Number(searchParams.get('page')) - 1) * Number(itemsPerPage) + 1 : 1} - 
              ${productData.total < Number(itemsPerPage) * (Number(searchParams.get('page')) || 1) ? productData.total : Number(itemsPerPage) * (Number(searchParams.get('page')) || 1)} 
              of ${productData.total} items`
            ) : 'No items found'}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
          {/* Sort */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            {state ? (
              <Select value={state} onChange={handleSortChange}>
                {sortData.map(item => (
                  <MenuItem key={item.title} value={item.title}>{item.title}</MenuItem>
                ))}
              </Select>
            ) : <Skeleton variant="rounded" width={150} height={40} />}
          </FormControl>

          {/* Items per page */}
          <FormControl size="small" sx={{ maxWidth: 120 }}>
            <Select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              {['12', '18', '24', '30'].map(item => (
                <MenuItem key={item} value={item}>Show: {item}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Filters Drawer */}
          <Button onClick={() => setOpenDrawer(true)} variant="outlined" color="inherit" endIcon={<MdTune />}
            sx={{ minWidth: 100, borderRadius: 1, fontWeight: 500 }}>
            Filters
          </Button>
        </Stack>
      </Stack>

      <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}
        sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, p: 2, bgcolor: 'background.paper' } }}
      >
        <PhysicalFilter filters={filters} pathname="/track-products" isMobile onClose={() => setOpenDrawer(false)} />
      </Drawer>
    </Paper>
  );
}

SortBar.propTypes = {
  productData: PropTypes.object.isRequired,
  sortData: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  filters: PropTypes.array,
};
