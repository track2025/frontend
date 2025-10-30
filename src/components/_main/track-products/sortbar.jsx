'use client';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { isString } from 'lodash';

// mui
import { Stack, Drawer } from '@mui/material';
import { Typography, Skeleton, Button } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// next
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
// icon
import { MdTune } from 'react-icons/md';
import shape from 'src/theme/shape';
import PhysicalFilter from './filters';

export default function SortBar({ productData, isLoading, sortData, filters, category, subCategory }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [itemsPerPage, setItemsPerPage] = useState('12');
  const top = searchParams.get('top');
  const name = searchParams.get('name');
  const date = searchParams.get('date');
  const price = searchParams.get('price');
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');
  const categoryParam = searchParams.get('category');
  const subCategoryParam = searchParams.get('subCategory');

  const [state, setState] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || '');
  const [selectedSubCategory, setSelectedSubCategory] = useState(subCategoryParam || '');
  const [availableSubCategories, setAvailableSubCategories] = useState([]);

  const createQueryString = useCallback(
    (name, value, key) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      if (name !== key) {
        params.delete(key);
      }
      return params.toString();
    },
    [searchParams]
  );

  const setQueryParam = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleChange = (event) => {
    const filtered = sortData.find((item) => item.title === event.target.value);

    if (state) {
      const sortedData = sortData.find((item) => item.title === state);
      const key = sortedData?.key;

      router.push(`${pathname}?${createQueryString([filtered.key], filtered.value, key)}`, 'isPathname');
      setState(filtered.title);
    } else {
      router.push(`${pathname}?${createQueryString([filtered.key], filtered.value)}`, 'isPathname');
      setState(filtered.title);
    }
  };

  // Handle category change
  const handleCategoryChange = (event) => {
    const categorySlug = event.target.value;
    setSelectedCategory(categorySlug);
    setSelectedSubCategory(''); // Reset subcategory when category changes

    // Update available subcategories based on selected category
    if (categorySlug && category?.subCategories) {
      const categoryData = category.subCategories.find(cat => cat.slug === categorySlug);
      setAvailableSubCategories(categoryData?.children || []);
    } else {
      setAvailableSubCategories([]);
    }

    router.push(`${pathname}?${setQueryParam('category', categorySlug)}`, 'isPathname');
  };

  // Handle subcategory change
  const handleSubCategoryChange = (event) => {
    const subCategorySlug = event.target.value;
    setSelectedSubCategory(subCategorySlug);
    router.push(`${pathname}?${setQueryParam('subCategory', subCategorySlug)}`, 'isPathname');
  };

  // Initialize available subcategories
  useEffect(() => {
    if (selectedCategory && category?.subCategories) {
      const categoryData = category.subCategories.find(cat => cat.slug === selectedCategory);
      setAvailableSubCategories(categoryData?.children || []);
    }
  }, [selectedCategory, category]);

  useEffect(() => {
    setItemsPerPage(isString(limit) ? limit : '12');
    setState(
      top === '-1'
        ? 'Top Rated'
        : name === '1'
          ? 'Asceding'
          : name === '-1'
            ? 'Desceding'
            : date === '1'
              ? 'Oldest'
              : date === '-1'
                ? 'Newest'
                : price === '1'
                  ? 'Price low to high'
                  : price === '-1'
                    ? 'Price high to low'
                    : 'Top Rated'
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name || date || price || limit || top]);

  return (
    <>
      <Stack
        pt={2}
        alignItems="center"
        justifyContent={'space-between'}
        sx={{
          flexDirection: { md: 'row', xs: 'column-reverse' },
          button: {
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: '4px',
            '&.active': {
              border: (theme) => `1px solid ${theme.palette.primary.main}`,
              svg: {
                color: 'primary.main'
              }
            }
          }
        }}
      >
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mt: { md: 0, xs: 1.5 },
            fontSize: {
              sm: '1rem',
              xs: '12px'
            }
          }}
        >
          {isLoading ? (
            <Skeleton variant="text" width={150} />
          ) : (
            productData !== 0 && (
              <>
                Showing {page ? `${(Number(page) - 1) * Number(itemsPerPage) + 1}` : 1}-
                {productData?.total < Number(itemsPerPage) * (Number(page) || 1)
                  ? productData?.total
                  : Number(itemsPerPage) * (Number(page) || 1)}{' '}
                of {productData?.total} items
              </>
            )
          )}
        </Typography>


        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
          
          {/* Category Dropdown */}
          {category?.subCategories && (
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                displayEmpty
              >
                <MenuItem value="">All Categories</MenuItem>
                {category.subCategories.map((cat) => (
                  <MenuItem key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Subcategory Dropdown */}
          {availableSubCategories.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={selectedSubCategory}
                onChange={handleSubCategoryChange}
                displayEmpty
              >
                <MenuItem value="">All Subcategories</MenuItem>
                {availableSubCategories.map((subCat) => (
                  <MenuItem key={subCat.slug} value={subCat.slug}>
                    {subCat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button
            onClick={() => setOpenDrawer(true)}
            variant="outlined"
            color="inherit"
            endIcon={<MdTune />}
            sx={{
              minWidth: { xs: 94, md: 120 },
              justifyContent: 'space-between',
              borderRadius: shape.borderRadius + '!important',
              fontWeight: 400,
              fontSize: 16
            }}
          >
            Filters
          </Button>

          <FormControl
            size="small"
            sx={{
              minWidth: { xs: 100, md: 180 }
            }}
          >
            {state || state === '' ? (
              <Select id="sort-select" value={state} onChange={handleChange}>
                {sortData.map((item) => (
                  <MenuItem key={Math.random()} value={item.title}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <Skeleton variant="rounded" width={150} height={40} />
            )}
          </FormControl>

          <FormControl size="small" sx={{ maxWidth: 120 }}>
            <Select
              id="items-select"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(e.target.value);
                router.push(`${pathname}?${createQueryString('limit', e.target.value)}`, 'isPathname');
              }}
              sx={{
                '& .MuiSelect-select': {
                  textTransform: 'capitalize'
                }
              }}
            >
              {['12', '18', '24', '30'].map((item) => (
                <MenuItem
                  key={Math.random()}
                  value={item}
                  sx={{
                    textTransform: 'capitalize'
                  }}
                >
                  Show: {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Drawer
        anchor={'right'}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            borderRadius: '0px !important',
            bgcolor: (theme) => theme.palette.background.paper
          }
        }}
      >
        <PhysicalFilter filters={filters} pathname="/track-products" isMobile onClose={() => setOpenDrawer(false)} />
      </Drawer>
    </>
  );
}

// Update propTypes
SortBar.propTypes = {
  productData: PropTypes.object.isRequired,
  sortData: PropTypes.array.isRequired,
  category: PropTypes.object,
  subCategory: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  filters: PropTypes.array,
};