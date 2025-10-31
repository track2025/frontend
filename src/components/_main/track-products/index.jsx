'use client';
// react
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'next/navigation';

// mui
import { useMediaQuery } from '@mui/material';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

// components
import ProductList from './product-list';
import SortBar from './sortbar';
import Pagination from 'src/components/pagination';

ProductListing.propTypes = {
  category: PropTypes.object,
  subCategory: PropTypes.object,
  brand: PropTypes.object,
  filters: PropTypes.array
};

// dynamic components
const sortData = [
  { title: 'Top Rated', key: 'top', value: -1 },
  { title: 'Asceding', key: 'name', value: 1 },
  { title: 'Desceding', key: 'name', value: -1 },
  { title: 'Price low to high', key: 'price', value: 1 },
  { title: 'Price high to low', key: 'price', value: -1 },
  { title: 'Oldest', key: 'date', value: 1 },
  { title: 'Newest', key: 'date', value: -1 }
];

const getSearchParams = (searchParams, category, subCategory, brand, rate) => {
  const params = new URLSearchParams(searchParams.toString());

  if (category?._id) params.set('category', category.slug);
  if (subCategory?._id) params.set('subcategory', subCategory.slug);
  if (brand?._id) params.set('brand', brand.slug);
  if (rate) params.set('rate', rate);

  const queryString = params.toString();
  return queryString.length ? '?' + queryString : '';
};

export default function ProductListing({ category, subCategory, brand, filters }) {
  const searchParams = useSearchParams();
  const searchQuery = getSearchParams(searchParams, category, subCategory, brand);

  const { data, isPending: isLoading } = useQuery({
    queryKey: [searchQuery],
    queryFn: () => api.getUserPhysicalProducts(searchQuery)
  });

  const [cate, setCate] = useState(null);
  const isMobile = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await api.getAllPhysicalCategoriesByAdmin();
        setCate(categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  if (!cate) return null; // or a loader while categories load
  console.log("categories:", cate);

  return (
    <>
      <SortBar
        sortData={sortData}
        productData={data}
        isLoading={isLoading}
        filters={filters}
        category={cate}
        subCategory={subCategory}
      />
      <ProductList data={data} isLoading={isLoading} isMobile={isMobile} />
      <Pagination data={data} />
    </>
  );
}
