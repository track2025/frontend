'use client';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, useMemo } from 'react';
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
  styled,
  Box,
  Collapse,
  Chip
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildIcon from '@mui/icons-material/Build';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CancelIcon from '@mui/icons-material/Cancel';

// next
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';

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

export default function SortBar({
  compaign,
  productData,
  shop,
  isLoading,
  sortData,
  category,
  subCategory,
  showLocationSearch = false,
  showApplyButton = false,
  defaultItemsPerPage = '12'
}) {
  // filterData
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const top = searchParams.get('top');
  const name = searchParams.get('name');
  const date = searchParams.get('date');
  const price = searchParams.get('price');
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');
  const searchQuery = searchParams.get('search') || '';
  const makeQuery = searchParams.get('make') || '';
  const modelQuery = searchParams.get('model') || '';
  const locationQuery = searchParams.get('location') || '';
  const dateQuery = searchParams.get('date_captured') || '';

  const [state, setState] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [search, setSearch] = useState(searchQuery);
  const [location, setLocation] = useState(locationQuery);
  const [make, setMake] = useState(makeQuery);
  const [model, setModel] = useState(modelQuery);
  const [dateCaptured, setDateCaptured] = useState(dateQuery);
  const [focus, setFocus] = useState(false);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [ITEMS_PER_PAGE_OPTIONS, setITEMS_PER_PAGE_OPTIONS] = useState(['12', '24', '32', '40']);
  // Track applied filters (from URL)
  const [appliedFilters, setAppliedFilters] = useState({
    search: searchQuery,
    location: locationQuery,
    make: makeQuery,
    model: modelQuery,
    date_captured: dateQuery
  });

  // Helper function to check if there are active filters from URL (excluding limit and page)
  const hasActiveFiltersFromUrl = useCallback(() => {
    return !!(
      searchQuery?.trim() ||
      makeQuery?.trim() ||
      modelQuery?.trim() ||
      dateQuery ||
      locationQuery?.trim() ||
      top ||
      name ||
      date ||
      price // sort parameters
    );
  }, [searchQuery, makeQuery, modelQuery, dateQuery, locationQuery, top, name, date, price]);

  // Sync local state with URL params when they change externally
  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setLocation(locationQuery);
  }, [locationQuery]);

  useEffect(() => {
    setMake(makeQuery);
  }, [makeQuery]);

  useEffect(() => {
    setModel(modelQuery);
  }, [modelQuery]);

  useEffect(() => {
    setDateCaptured(dateQuery);
  }, [dateQuery]);

  // Update applied filters when URL params change
  useEffect(() => {
    setAppliedFilters({
      search: searchQuery,
      location: locationQuery,
      make: makeQuery,
      model: modelQuery,
      date_captured: dateQuery
    });
  }, [searchQuery, locationQuery, makeQuery, modelQuery, dateQuery]);

  // Check if any current inputs have values (for Apply button)
  const hasActiveInputs = useMemo(() => {
    return !!(search?.trim() || location?.trim() || make?.trim() || model?.trim() || dateCaptured);
  }, [search, location, make, model, dateCaptured]);

  // Check if any filters are applied (from URL)
  const hasAppliedFilters = useMemo(() => {
    return !!(
      appliedFilters.search?.trim() ||
      appliedFilters.location?.trim() ||
      appliedFilters.make?.trim() ||
      appliedFilters.model?.trim() ||
      appliedFilters.date_captured
    );
  }, [appliedFilters]);

  // Get active applied filters for display (from URL)
  const activeAppliedFilters = useMemo(() => {
    const filters = [];

    if (appliedFilters.search?.trim()) {
      filters.push({
        key: 'search',
        label: `Registration: ${appliedFilters.search.trim()}`,
        value: appliedFilters.search.trim()
      });
    }

    if (appliedFilters.location?.trim()) {
      filters.push({
        key: 'location',
        label: `Location: ${appliedFilters.location.trim()}`,
        value: appliedFilters.location.trim()
      });
    }

    if (appliedFilters.make?.trim()) {
      filters.push({ key: 'make', label: `Make: ${appliedFilters.make.trim()}`, value: appliedFilters.make.trim() });
    }

    if (appliedFilters.model?.trim()) {
      filters.push({
        key: 'model',
        label: `Model: ${appliedFilters.model.trim()}`,
        value: appliedFilters.model.trim()
      });
    }

    if (appliedFilters.date_captured) {
      const formattedDate = new Date(appliedFilters.date_captured).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      filters.push({ key: 'date_captured', label: `Date: ${formattedDate}`, value: appliedFilters.date_captured });
    }

    return filters;
  }, [appliedFilters]);

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

  // Apply all filters at once
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    // Update or remove each filter parameter
    if (search.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }

    if (location.trim()) {
      params.set('location', location.trim());
    } else {
      params.delete('location');
    }

    if (make.trim()) {
      params.set('make', make.trim());
    } else {
      params.delete('make');
    }

    if (model.trim()) {
      params.set('model', model.trim());
    } else {
      params.delete('model');
    }

    if (dateCaptured) {
      params.set('date_captured', dateCaptured);
    } else {
      params.delete('date_captured');
    }

    // Reset to page 1 when applying filters, but remove default values
    params.delete('page'); // Remove page param - defaults to 1

    // Remove limit if it's the default value
    if (params.get('limit') === defaultItemsPerPage) {
      params.delete('limit');
    }

    router.push(`${pathname}?${params.toString()}`, 'isPathname');
  }, [search, location, make, model, dateCaptured, pathname, router, searchParams]);

  // Clear individual filter and update URL immediately
  const clearFilter = useCallback(
    (filterName) => {
      const params = new URLSearchParams(searchParams);
      params.delete(filterName);

      // Also update local state
      switch (filterName) {
        case 'search':
          setSearch('');
          break;
        case 'location':
          setLocation('');
          break;
        case 'make':
          setMake('');
          break;
        case 'model':
          setModel('');
          break;
        case 'date_captured':
          setDateCaptured('');
          break;
      }

      // Reset to page 1 when clearing filters, but remove default values
      params.delete('page'); // Remove page param - defaults to 1

      // Remove limit if it's the default value
      if (params.get('limit') === defaultItemsPerPage) {
        params.delete('limit');
      }

      router.push(`${pathname}?${params.toString()}`, 'isPathname');
    },
    [pathname, router, searchParams]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    // Remove all filter parameters including page and sort params
    ['search', 'location', 'make', 'model', 'date_captured', 'page', 'top', 'name', 'date', 'price'].forEach(
      (param) => {
        params.delete(param);
      }
    );

    // Reset local state
    setSearch('');
    setLocation('');
    setMake('');
    setModel('');
    setDateCaptured('');

    // Remove limit if it's the default value
    if (params.get('limit') === defaultItemsPerPage) {
      params.delete('limit');
    }

    router.push(`${pathname}?${params.toString()}`, 'isPathname');
  }, [pathname, router, searchParams]);

  // Set default sort state to first item in sortData
  useEffect(() => {
    const defaultSort = sortData?.[3]?.title || 'Newest';
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
                    : defaultSort
    );
  }, [name, date, price, limit, top, sortData]);

  // Update itemsPerPage when limit changes in URL
  useEffect(() => {
    if (limit && ITEMS_PER_PAGE_OPTIONS.includes(limit)) {
      setItemsPerPage(limit);
    } else {
      // If no limit in URL or invalid, default to DEFAULT_ITEMS_PER_PAGE but don't add to URL
      setItemsPerPage(defaultItemsPerPage);
    }
  }, [limit]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  return (
    <>
      <Stack spacing={2} pt={2}>
        {/* Search Filters Row */}
        {/* Search Filters Row */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="stretch" justifyContent="space-between">
          {/* Date Filter - Takes up more space */}
          <Stack direction="row" gap={1} flex={2} width="100%">
            {' '}
            {/* Changed flex from 1 to 2 */}
            <FormControl
              fullWidth
              sx={{
                maxWidth: { xs: '100%', sm: 'none' }, // Remove maxWidth on desktop
                minWidth: { xs: 'auto', sm: 'auto' }, // Allow it to grow
                flex: 1
              }}
            >
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
                  onKeyDown={onKeyDown}
                  InputLabelProps={{
                    shrink: true // This makes the label always visible when focused or has value
                  }}
                  label="Filter by Date" // Add a label for better UX
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {dateCaptured && (
                          <IconButton
                            size="small"
                            onClick={() => clearFilter('date_captured')}
                            edge="end"
                            sx={{ padding: '4px' }}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        )}
                      </InputAdornment>
                    )
                  }}
                  // Additional styling for better mobile appearance
                  sx={{
                    '& .MuiInputLabel-root': {
                      transform: 'translate(14px, 9px) scale(1)', // Position label inside the field
                      '&.MuiInputLabel-shrink': {
                        transform: 'translate(14px, -9px) scale(0.75)' // Standard MUI label positioning when shrunk
                      }
                    },
                    '& .MuiInputBase-input': {
                      '&::placeholder': {
                        opacity: 1, // Ensure placeholder is visible
                        color: 'text.secondary'
                      }
                    }
                  }}
                  placeholder={dateCaptured ? '' : 'Select Date'} // Fallback placeholder
                />
              )}
            </FormControl>
          </Stack>

          {/* Advanced Filters Button - Takes up less space */}
          <Button
            variant="outlined"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            endIcon={showAdvancedFilters ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            sx={{
              minWidth: { xs: '100%', sm: 200 }, // Slightly increased from 180
              width: { xs: '100%', sm: 'auto' },
              justifyContent: 'space-between',
              borderColor: 'divider',
              color: 'text.primary',
              flex: 1, // Give it some flex but less than date
              '&:hover': {
                borderColor: 'text.secondary', // Slightly darker on hover
                backgroundColor: 'action.hover' // Add subtle hover background
              }
            }}
          >
            {showAdvancedFilters ? 'Hide Filters' : 'Advanced Filters'}
          </Button>
        </Stack>

        {/* Advanced Filters - Collapsible */}
        <Collapse in={showAdvancedFilters}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="stretch">
            {/* Registration - Only show in advanced when location is primary */}
            {showLocationSearch && (
              <TextField
                size="small"
                fullWidth
                placeholder="Search by Registration"
                value={search}
                onFocus={() => setFocus(true)}
                onKeyDown={onKeyDown}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DirectionsCarIcon />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => clearFilter('search')} edge="end" sx={{ padding: '4px' }}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  minWidth: { xs: 'auto', sm: 200 }
                }}
              />
            )}

            {/* Car Make */}
            <TextField
              size="small"
              fullWidth
              placeholder="Filter by Car Make"
              value={make}
              onFocus={() => setFocus(true)}
              onKeyDown={onKeyDown}
              onChange={(e) => setMake(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BuildIcon />
                  </InputAdornment>
                ),
                endAdornment: make && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => clearFilter('make')} edge="end" sx={{ padding: '4px' }}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                minWidth: { xs: 'auto', sm: 200 }
              }}
            />

            {/* Car Model */}
            <TextField
              size="small"
              fullWidth
              placeholder="Filter by Car Model"
              value={model}
              onFocus={() => setFocus(true)}
              onKeyDown={onKeyDown}
              onChange={(e) => setModel(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DirectionsCarFilledIcon />
                  </InputAdornment>
                ),
                endAdornment: model && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => clearFilter('model')} edge="end" sx={{ padding: '4px' }}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                minWidth: { xs: 'auto', sm: 200 }
              }}
            />
          </Stack>
        </Collapse>

        {/* Applied Filters Display - Only show filters that are actually applied in URL */}
        {hasAppliedFilters && (
          <Box sx={{ mt: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" gap={1}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Applied filters:
              </Typography>
              {activeAppliedFilters.map((filter) => (
                <Chip
                  key={filter.key}
                  label={filter.label}
                  size="small"
                  onDelete={() => clearFilter(filter.key)}
                  deleteIcon={<CancelIcon />}
                  variant="outlined"
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '& .MuiChip-deleteIcon': {
                      color: 'primary.main',
                      '&:hover': {
                        color: 'primary.dark'
                      }
                    }
                  }}
                />
              ))}
              <Button size="small" onClick={clearAllFilters} sx={{ minWidth: 'auto', fontSize: '0.75rem' }}>
                Clear all
              </Button>
            </Stack>
          </Box>
        )}

        {/* Sort, Items Per Page, and Apply Filters Button */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 1 }}
          alignItems="stretch"
          justifyContent="space-between"
          useFlexGap
        >
          {/* Apply Filters Button - Left side, only show when showApplyButton is true */}
          {showApplyButton && (
            <Button
              variant="contained"
              onClick={applyFilters}
              startIcon={<FilterAltIcon />}
              disabled={!hasActiveInputs}
              sx={{
                bgcolor: '#EE1E50',
                color: 'white',
                '&:hover': {
                  bgcolor: '#d01745'
                },
                '&.Mui-disabled': {
                  opacity: 0.4,
                  bgcolor: '#EE1E50',
                  color: 'white'
                },
                minWidth: { xs: '100%', sm: 160 },
                width: { xs: '100%', sm: 'auto' },
                order: { xs: 2, sm: 1 }
              }}
            >
              Apply Filters
            </Button>
          )}

          {/* Right aligned container */}
          <Box
            sx={{
              width: showApplyButton ? { xs: '100%', sm: 'auto' } : '100%',
              display: 'flex',
              justifyContent: { xs: 'flex-start', sm: 'flex-end' },
              order: { xs: 1, sm: 2 }
            }}
          >
            <Stack
              direction="row"
              gap={1}
              alignItems="center"
              sx={{
                width: '100%',
                justifyContent: { xs: 'space-between', sm: 'flex-end' },
                flexWrap: { xs: 'wrap', sm: 'nowrap' }
              }}
            >
              {/* Sort Dropdown */}
              <FormControl
                size="small"
                sx={{
                  minWidth: { xs: '48%', sm: 180 },
                  maxWidth: { xs: '48%', sm: 180 },
                  flex: { xs: 1, sm: 'none' }
                }}
              >
                {state || state === '' ? (
                  <Select id="sort-select" value={state} onChange={handleChange} displayEmpty>
                    {sortData.map((item) => (
                      <MenuItem key={Math.random()} value={item.title}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Skeleton variant="rounded" width="100%" height={40} />
                )}
              </FormControl>

              {/* Items Per Page Dropdown */}
              <FormControl
                size="small"
                sx={{
                  minWidth: { xs: '48%', sm: 140 },
                  maxWidth: { xs: '48%', sm: 140 },
                  flex: { xs: 1, sm: 'none' }
                }}
              >
                <Select
                  id="items-select"
                  value={itemsPerPage}
                  onChange={(e) => {
                    const newLimit = e.target.value;
                    setItemsPerPage(newLimit);

                    const params = new URLSearchParams(searchParams);

                    // Only add limit to URL if it's not the default
                    if (newLimit === defaultItemsPerPage) {
                      params.delete('limit');
                    } else {
                      params.set('limit', newLimit);
                    }

                    // Remove page param when changing limit (reset to page 1)
                    params.delete('page');

                    router.push(`${pathname}?${params.toString()}`, 'isPathname');
                  }}
                  displayEmpty
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((item) => (
                    <MenuItem key={Math.random()} value={item}>
                      Show: {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Box>
        </Stack>
      </Stack>
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
  shop: PropTypes.object,
  showLocationSearch: PropTypes.bool,
  showApplyButton: PropTypes.bool
};
