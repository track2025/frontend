'use client';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { isString } from 'lodash';
import { Stack, Drawer, Typography, Skeleton, Button, MenuItem, FormControl, Select, Paper } from '@mui/material';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import { MdTune } from 'react-icons/md';
import shape from 'src/theme/shape';
import PhysicalFilter from './filters';
import * as api from 'src/services';

export default function SortBar({ productData, isLoading, sortData, filters, category = { data: [] } }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [itemsPerPage, setItemsPerPage] = useState('12');
  const [state, setState] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSubCategory, setSelectedSubCategory] = useState(searchParams.get('subCategory') || '');
  const [availableSubCategories, setAvailableSubCategories] = useState([]);

  // Helper to update query param in URL
  const updateQuery = useCallback((params) => {
    const query = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.set(key, value);
      else query.delete(key);
    });
    router.push(`${pathname}?${query.toString()}`, 'isPathname');
  }, [router, pathname, searchParams]);

  // Handle category change
  const handleCategoryChange = async (event) => {
    const categorySlug = event.target.value;
    setSelectedCategory(categorySlug);
    setSelectedSubCategory('');
    setAvailableSubCategories([]);

    updateQuery({ category: categorySlug, subCategory: '' });

    if (categorySlug) {
      try {
        const response = await api.getPhysicalSubCategoriesByCategory(categorySlug);
        setAvailableSubCategories(response?.data || []);
      } catch {
        setAvailableSubCategories([]);
      }
    }
  };

  // Handle subcategory change
  const handleSubCategoryChange = (event) => {
    const subCategorySlug = event.target.value;
    setSelectedSubCategory(subCategorySlug);
    updateQuery({ subCategory: subCategorySlug });
  };

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

    // Sync category and subcategory from URL
    const categoryParam = searchParams.get('category') || '';
    const subCategoryParam = searchParams.get('subCategory') || '';
    setSelectedCategory(categoryParam);
    setSelectedSubCategory(subCategoryParam);

    if (categoryParam) {
      api.getPhysicalSubCategoriesByCategory(categoryParam)
        .then(res => setAvailableSubCategories(res?.data || []))
        .catch(() => setAvailableSubCategories([]));
    } else {
      setAvailableSubCategories([]);
    }
  }, [searchParams]);

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2, mt: 4, borderRadius: 2 }}>
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
          {/* Category */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select value={selectedCategory} onChange={handleCategoryChange} displayEmpty>
              <MenuItem value="">All Categories</MenuItem>
              {category.data.map(cat => (
                <MenuItem key={cat.slug} value={cat.slug}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Subcategory */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}
              displayEmpty
              disabled={!availableSubCategories.length}
            >
              <MenuItem value="">All Subcategories</MenuItem>
              {availableSubCategories.map(sub => (
                <MenuItem key={sub.slug} value={sub.slug}>{sub.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

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
  category: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  filters: PropTypes.array,
};
