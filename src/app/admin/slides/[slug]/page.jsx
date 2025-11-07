'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditSlide from 'src/components/_admin/slides/editSlide';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';


Page.propTypes = {
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired
  }).isRequired
};
export default function Page({ params }) {
  const { data, isLoading } = useQuery(['slide'], () => api.getSlideByAdmin(params.slug), {
    onError: (err) => {
      toast.error(err.message || 'Failed to load slide!');
    }
  });

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit Slide"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Slides',
            href: '/admin/slides'
          },
          {
            name: data?.data?.title
          }
        ]}
      />
      <EditSlide isLoading={isLoading} data={data?.data} />
    </div>
  );
}
