'use client';
import React from 'react';
import PropTypes from 'prop-types';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
import PhysicalProductForm from 'src/components/forms/physical-product/physicalProductForm';

EditPhysicalProduct.propTypes = {
  brands: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  slug: PropTypes.string.isRequired,
  isVendor: PropTypes.boolean
};

export default function EditPhysicalProduct({ brands, categories, slug, isVendor }) {
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['coupon-codes', slug, isVendor], // Added slug and isVendor as dependencies
    queryFn: () => api[isVendor ? 'getVendorProductBySlug' : 'getPhysicalProductByAdmin'](slug)
  });

  return (
    <PhysicalProductForm
      brands={brands}
      categories={categories}
      currentProduct={data?.data}
      isLoading={isLoading}
      isVendor={isVendor}
    />
  );
}
