'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMediaQuery } from '@mui/material';
import { useQuery } from 'react-query';

import * as api from 'src/services';
import ProductList from './product-list';
import SortBar from './sortbar';
import Pagination from 'src/components/pagination';

interface ProductListingProps {
  category?: any;
  subCategory?: any;
  brand?: any;
  filters: any[];
  initialProducts?: any[];
}

const sortData = [
  { title: 'Top Rated', key: 'top', value: -1 },
  { title: 'Ascending', key: 'name', value: 1 },
  { title: 'Descending', key: 'name', value: -1 },
  { title: 'Price low to high', key: 'price', value: 1 },
  { title: 'Price high to low', key: 'price', value: -1 },
  { title: 'Oldest', key: 'date', value: 1 },
  { title: 'Newest', key: 'date', value: -1 }
];

const getSearchParams = (searchParams: URLSearchParams, category?: any, subCategory?: any, brand?: any, rate?: any) => {
  const params = new URLSearchParams(searchParams.toString());
  if (category?._id) params.set('category', category.slug);
  if (subCategory?._id) params.set('subcategory', subCategory.slug);
  if (brand?._id) params.set('brand', brand.slug);
  if (rate) params.set('rate', rate);
  const queryString = params.toString();
  return queryString.length ? '?' + queryString : '';
};

export default function ProductListing({
  category,
  subCategory,
  brand,
  filters,
  initialProducts = []
}: ProductListingProps) {
  const searchParams = useSearchParams();
  const searchQuery = getSearchParams(searchParams, category, subCategory, brand);

  const [displayData, setDisplayData] = useState<any[]>(initialProducts);
  const [cate, setCate] = useState<any[] | null>(null);
  const isMobile = useMediaQuery('(max-width:900px)');

  const { data, isLoading } = useQuery({
    queryKey: [searchQuery],
    queryFn: () => api.getUserPhysicalProducts(searchQuery),
    // Don't use initialData here to avoid conflicts with our manual state management
  });

  // Update displayData when initialProducts changes (from server props)
  useEffect(() => {
    console.log("Initial products updated:", initialProducts);
    setDisplayData(initialProducts);
  }, [initialProducts]);

  // Update displayData when react-query data changes (client-side filtering)
  useEffect(() => {
    if (data) {
      console.log("Query data updated:", data);
      setDisplayData(data);
    }
  }, [data]);

  // Always use displayData for rendering
  useEffect(() => {
    console.log("Current display data:", displayData);
  }, [displayData]);

  // Fetch categories
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

  if (!cate) return null;

  return (
    <>
      <SortBar
        sortData={sortData}
        productData={displayData}
        isLoading={isLoading}
        filters={filters}
      />
      <ProductList data={displayData} isLoading={isLoading} isMobile={isMobile} />
      <Pagination data={displayData} />
    </>
  );
}