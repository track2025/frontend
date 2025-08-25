'use client';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { isString } from 'lodash';

// mui
import { 
  Stack, 
  Drawer, 
  TextField, 
  InputAdornment, 
  CircularProgress, 
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Skeleton,
  Button,
  styled
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

// next
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
// icon
import { MdTune } from 'react-icons/md';
// dynamic component
const Filter = dynamic(() => import('src/components/_main/products/filters'), {
  loading: () => <Skeleton variant="rounded" width={'100%'} height={185} />
});

// Styled component for the date filter label
const LabelStyle = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
  fontWeight: 500
}));

export default function SortBar({ compaign, productData, shop, isLoading, sortData, category, subCategory }) {
  // filterData
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
  const searchQuery = searchParams.get('search') || '';
  const dateQuery = searchParams.get('date_captured') || '';

  const [state, setState] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [search, setSearch] = useState(searchQuery);
  const [dateCaptured, setDateCaptured] = useState(dateQuery);
  const [focus, setFocus] = useState(false);
  const [filtersLoading, setFiltersLoading] = useState(false);

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

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search !== searchQuery) {
        router.push(`${pathname}?${setQueryParam('search', search)}`, 'isPathname');
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, pathname, router, setQueryParam, searchQuery]);

  // Handle date filter change
  useEffect(() => {
    if (dateCaptured !== dateQuery) {
      router.push(`${pathname}?${setQueryParam('date_captured', dateCaptured)}`, 'isPathname');
    }
  }, [dateCaptured, pathname, router, setQueryParam, dateQuery]);

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

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      router.push(`${pathname}?${setQueryParam('search', search)}`, 'isPathname');
    }
  };

  return (
    <>
      <Stack spacing={2} pt={2}>
        {/* Search Bar */}
        <TextField
          id="standard-basic"
          variant="standard"
          placeholder="Enter a location, reg. #, model or make"
          value={search}
          onFocus={() => setFocus(true)}
          onKeyDown={onKeyDown}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ justifyContent: 'center' }}>
                {isLoading ? (
                  <CircularProgress sx={{ width: '24px !important', height: '24px !important' }} />
                ) : (
                  <SearchIcon />
                )}
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiInput-root': {
              height: { lg: 72, md: 72, sm: 72, xs: 56 }
            },
            '& .MuiInputAdornment-root': {
              width: 100,
              mr: 0,
              svg: {
                mx: 'auto',
                color: 'primary.main'
              }
            }
          }}
        />

        {/* Date Filter and Action Buttons */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Date Filter */}
          <Stack direction="row" gap={1} flex={1}>
            <FormControl fullWidth sx={{ maxWidth: 250 }}>
              <LabelStyle component="label" htmlFor="date">
                Date Captured
              </LabelStyle>

              {filtersLoading ? (
                <Skeleton variant="rounded" height={40} width="100%" />
              ) : (
                <TextField
                  id="date"
                  type="date"
                  size="small"
                  fullWidth
                  value={dateCaptured}
                  onChange={(e) => setDateCaptured(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {dateCaptured && (
                          <IconButton
                            size="small"
                            onClick={() => setDateCaptured('')}
                            edge="end"
                            sx={{ padding: '4px' }}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                    sx: {
                      height: 40,
                      '& input': {
                        height: '100%',
                        padding: '8.5px 14px'
                      },
                      // Hide the native calendar icon when our clear button is shown
                      '& input[type="date"]::-webkit-calendar-picker-indicator': {
                        display: dateCaptured ? 'none' : 'block'
                      }
                    }
                  }}
                />
              )}
            </FormControl>
          </Stack>

          {/* Sort and Items Per Page */}
          <Stack direction="row" gap={1} alignItems="center">
            <FormControl size="small" fullWidth sx={{ maxWidth: 150 }}>
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
            
            <FormControl size="small" fullWidth sx={{ maxWidth: 120 }}>
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

            {/* Filter Button for Mobile */}
            <Button
              onClick={() => setOpenDrawer(true)}
              variant="outlined"
              color="inherit"
              endIcon={<MdTune />}
              sx={{
                minWidth: 120,
                justifyContent: 'space-between',
                display: { xs: 'flex', sm: 'none' }
              }}
            >
              Filters
            </Button>
          </Stack>
        </Stack>

        {/* Results Count */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
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
        <Filter
          category={category}
          subCategory={subCategory}
          shop={shop}
          pathname="/products"
          isMobile
          onClose={() => setOpenDrawer(false)}
        />
      </Drawer>
    </>
  );
}

// add propTypes
SortBar.propTypes = {
  productData: PropTypes.object.isRequired,
  sortData: PropTypes.array.isRequired,
  category: PropTypes.object.isRequired,
  subCategory: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  shop: PropTypes.object
};