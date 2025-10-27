'use client';
import React, { use } from 'react';
import PropTypes from 'prop-types';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditPhysicalCategory from 'src/components/_admin/physical-categories/sub/edit-category';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

Page.propTypes = { params: PropTypes.shape({ slug: PropTypes.string.isRequired }).isRequired };
export default function Page({ params }) {
  const { slug } = params;
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['sub-category-admin', slug],
    queryFn: () => api.getPhysicalSubCategoryByAdmin(slug)
  });
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Subcategories List"
        links={[
          { name: 'Dashboard', href: '/admin' },
          { name: 'Subcategories', href: '/admin/physical-categories/sub-categories' },
          { name: data?.data?.name }
        ]}
      />
      <EditPhysicalCategory data={data?.data} categories={data?.categories} isLoading={isLoading} />
    </div>
  );
}
