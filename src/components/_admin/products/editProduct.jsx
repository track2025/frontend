'use client';
import React from 'react';
import ProductForm from 'src/components/forms/product';
import PropTypes from 'prop-types';
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
EditProduct.propTypes = {
  brands: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  slug: PropTypes.string.isRequired,
  isVendor: PropTypes.boolean
};

export default function EditProduct({ brands, categories, slug, shops, isVendor }) {
  const { data, isLoading } = useQuery(
    ['coupon-codes'],
    () => api[isVendor ? 'getVendorProductBySlug' : 'getProductBySlug'](slug),
    {
      onError: (err) => {
        toast.error(err.response.data.message || 'Something went wrong!');
      }
    }
  );
  return (
    <div>
      <ProductForm
        shops={shops}
        brands={brands}
        categories={categories}
        currentProduct={data?.data}
        isLoading={isLoading}
        isVendor={isVendor}
      />
    </div>
  );
}
