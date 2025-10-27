import React from 'react';
// components
import BlogForm from 'src/components/forms/blog';

export default function addBrand({ data, isLoading }) {
  return (
    <div>
      <BlogForm data={data} isLoading={isLoading} />
    </div>
  );
}
