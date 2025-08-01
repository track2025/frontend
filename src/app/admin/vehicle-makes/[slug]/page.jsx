'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditCategory from 'src/components/_admin/categories/editCategory';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

Page.propTypes = {
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired
  }).isRequired
};
export default function Page({ params }) {
  const { data, isLoading } = useQuery(['coupon-codes'], () => api.getCategoryByAdmin(params.slug), {
    onError: (err) => {
      toast.error(err.response.data.message || 'We ran into an issue. Please refresh the page or try again.');
    }
  });
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Vehicle Make List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Categories',
            href: '/admin/vehicle-makes'
          },
          {
            name: data?.data?.name
          }
        ]}
      />
      <EditCategory isLoading={isLoading} data={data?.data} />
    </div>
  );
}
