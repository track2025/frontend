'use client';
import React from 'react';
// toolbar
import Toolbar from 'src/components/_admin/toolbar';
// breadcrumbs
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
// components
import EditBrand from 'src/components/_admin/brands/editBrand';
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

Page.propTypes = {
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired
  }).isRequired
};

export default function Page({ params }) {
  const { data, isLoading } = useQuery(['coupon-codes'], () => api.getBrandByAdmin(params.slug), {
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong!');
    }
  });
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Categories List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Brands',
            href: '/admin/brands'
          },
          {
            name: data?.data.name
          }
        ]}
      />
      <EditBrand data={data?.data} isLoading={isLoading} />
    </div>
  );
}
