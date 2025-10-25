'use client';
import React, { use } from 'react';
import PropTypes from 'prop-types';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditCategory from 'src/components/_admin/physical-categories/parent/edit-category';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

Page.propTypes = { params: PropTypes.shape({ slug: PropTypes.string.isRequired }).isRequired };
export default function Page(props) {
  const params = use(props.params);
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['coupon-codes', params.slug],
    queryFn: () => api.getCategoryByAdmin(params.slug)
  });
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit Category"
        links={[
          { name: 'Dashboard', href: '/admin/dashboard' },
          { name: 'Categories', href: '/admin/categories' },
          { name: 'Edit Category' }
        ]}
      />
      <EditCategory isLoading={isLoading} data={data?.data} />
    </div>
  );
}
