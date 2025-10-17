import React from 'react';
import PropTypes from 'prop-types';
import PhysicalSubCategoryForm from 'src/components/forms/physical-subCategory';

AddCategory.propTypes = {
  categories: PropTypes.array.isRequired
};

export default function AddCategory({ categories }) {
  return (
    <div>
      <PhysicalSubCategoryForm categories={categories} />
    </div>
  );
}
