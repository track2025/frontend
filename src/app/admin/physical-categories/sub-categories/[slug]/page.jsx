'use client';
import React, { use } from 'react';
import PropTypes from 'prop-types';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditCategory from 'src/components/_admin/physical-categories/sub/edit-category';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

Page.propTypes = { params: PropTypes.shape({ slug: PropTypes.string.isRequired }).isRequired };
export default function Page(props) {
  const params = use(props.params);
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['sub-category-admin', params.slug],
    queryFn: () => api.getSubCategoryByAdmin(params.slug)
  });
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Subcategories List"
        links={[
          { name: 'Dashboard', href: '/admin' },
          { name: 'Subcategories', href: '/admin/sub-categories' },
          { name: data?.data?.name }
        ]}
      />
      <EditCategory data={data?.data} categories={data?.categories} isLoading={isLoading} />
    </div>
  );
}
