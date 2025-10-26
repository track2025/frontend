import React from 'react';
import PropTypes from 'prop-types';
import PhysicalSubCategoryForm from 'src/components/forms/physical-subCategory';

AddSubCategory.propTypes = {
  categories: PropTypes.array.isRequired
};

export default function AddSubCategory({ categories }) {
  return (
    <div>
      <PhysicalSubCategoryForm categories={categories} />
    </div>
  );
}
