import React from 'react';
import PropTypes from 'prop-types';
import PhysicalSubCategoryForm from 'src/components/forms/physical-product/subCategory';

AddPhysicalSubCategory.propTypes = {
  categories: PropTypes.array.isRequired
};

export default function AddPhysicalSubCategory({ categories }) {
  return (
    <div>
      <PhysicalSubCategoryForm categories={categories} />
    </div>
  );
}
