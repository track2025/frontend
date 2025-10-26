'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
// components
import ProductForm from 'src/components/forms/product';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
EditProduct.propTypes = {
  brands: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  slug: PropTypes.string.isRequired,
  isVendor: PropTypes.boolean
};

export default function EditProduct({ brands, categories, slug, isVendor }) {
  const { data, isLoading } = useQuery(
    ['coupon-codes'],
    () => api[isVendor ? 'getVendorProductBySlug' : 'getProductBySlug'](slug),
    {
      onError: (err) => {
        toast.error(err.response.data.message || 'We ran into an issue. Please refresh the page or try again.');
      }
    }
  );
  return (
    <div>
      <ProductForm
        brands={brands}
        categories={categories}
        currentProduct={data?.data}
        isLoading={isLoading}
        isVendor={isVendor}
      />
    </div>
  );
}
