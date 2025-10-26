import React from 'react';
import PropTypes from 'prop-types';
import PhysicalSubCategoryForm from 'src/components/forms/physical-subCategory';
// components

EditCategory.propTypes = {
  data: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function EditCategory({ data, categories, isLoading }) {
  return <PhysicalSubCategoryForm data={data} categories={categories} isLoading={isLoading} />;
}
