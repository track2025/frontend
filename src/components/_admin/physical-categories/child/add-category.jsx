import React from 'react';
import PropTypes from 'prop-types';
import ChildCategoryForm from 'src/components/forms/child-category';
// components

AddCategory.propTypes = {
  categories: PropTypes.array.isRequired
};

export default function AddCategory({ categories }) {
  return (
    <div>
      <ChildCategoryForm categories={categories} />
    </div>
  );
}
