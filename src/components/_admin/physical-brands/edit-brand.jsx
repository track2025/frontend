import React from 'react';
// components
import PhysicalBrandsForm from 'src/components/forms/physical-product/brand';

export default function addBrand({ data, isLoading }) {
  return (
    <div>
      <PhysicalBrandsForm data={data} isLoading={isLoading} />
    </div>
  );
}
