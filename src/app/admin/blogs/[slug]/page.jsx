'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import EditBlog from 'src/components/_admin/blogs/editBlog';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// api
import { useQuery } from 'react-query';
import * as api from 'src/services';

Page.propTypes = {
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired
  }).isRequired
};

export default function Page({ params }) {
  const { data, isLoading } = useQuery(['single_blogs'], () => api.getBlogByAdmin(params.slug), {
    onError: (err) => {
      toast.error(err.response.data.message || 'We ran into an issue. Please refresh the page or try again.');
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
            href: '/admin/locations'
          },
          {
            name: data?.data?.name
          }
        ]}
      />
      <EditBlog data={data?.data} isLoading={isLoading} />
    </div>
  );
}
