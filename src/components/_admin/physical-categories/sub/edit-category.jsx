import React from 'react';
import PropTypes from 'prop-types';
import PhysicalSubCategoryForm from 'src/components/forms/physical-product/subCategory';
// components

EditPhysicalCategory.propTypes = {
  data: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function EditPhysicalCategory({ data, categories, isLoading }) {
  return <PhysicalSubCategoryForm data={data} categories={categories} isLoading={isLoading} />;
}
