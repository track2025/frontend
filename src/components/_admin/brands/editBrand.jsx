import React from 'react';
import BrandsForm from 'src/components/forms/brand';

export default function addBrand({ data, isLoading }) {
  return (
    <div>
      <BrandsForm data={data} isLoading={isLoading} />
    </div>
  );
}
