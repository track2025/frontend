'use client';
import React from 'react';
// mui
import { Card, Box, Typography, IconButton, Divider, Stack, Chip } from '@mui/material';
// Next
import { useRouter } from 'next-nprogress-bar';
// icons
import { MdClear } from 'react-icons/md';
// PropTypes;
import PropTypes from 'prop-types';
// react query
import { useQuery } from 'react-query';
// components
import BrandsFilter from './brands';
import GenderFilter from './gender';
import ColorsFilter from './colors';
import SizesFilter from './sizes';
import PriceRange from './price';
import Brands from 'src/components/_main/skeletons/products/filters/brands';
import Gender from 'src/components/_main/skeletons/products/filters/gander';
import Color from 'src/components/_main/skeletons/products/filters/colors';
import Sizes from 'src/components/_main/skeletons/products/filters/sizes';
import * as api from 'src/services';
import { useSearchParams } from 'next/navigation';
Filter.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchFilters: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  shop: PropTypes.object,
  category: PropTypes.object,
  subCategory: PropTypes.object
};

export default function Filter({ ...props }) {
  const { isMobile, onClose, pathname, fetchFilters, category, shop, subCategory } = props;
  const router = useRouter();
  const { data, isLoading } = useQuery(['get-filters' + shop || '' + category || '' + 'subCategory'], () =>
    api[fetchFilters](shop?.slug || '', category?.slug || '', subCategory?.slug || '')
  );
  //   const searchParams = useSearchParams();
  //   const brands = searchParams.get('brands');
  //   const allParams = Array.from(searchParams.values());
  const filters = data?.data;
  //   console.log(brands, 'hello12');
  return (
    <>
      <Stack direction="row" gap={1} mt={3}>
        {isLoading
          ? 'Loading....'
          : Boolean(filters?.brands?.length) && <BrandsFilter brands={filters?.brands} path={pathname} />}
        {isLoading
          ? 'Loading....'
          : Boolean(filters?.genders?.length) && <GenderFilter genders={filters?.genders} path={pathname} />}
      </Stack>
      {/* {allParams.map((param) => (
        <Chip label={param} key={param} onDelete={() => console.log('hello')} />
      ))} */}
    </>
  );
}
