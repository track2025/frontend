import React from 'react';
import PropTypes from 'prop-types';
// components
import PhysicalCategoryForm from 'src/components/forms/physical-product/category';

EditPhysicalCategory.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function EditPhysicalCategory({ data, isLoading }) {
  return (
    <div>
      <PhysicalCategoryForm data={data} isLoading={isLoading} />
    </div>
  );
}
