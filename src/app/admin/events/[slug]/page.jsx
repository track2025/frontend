'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import EditEvent from 'src/components/_admin/events/editEvent';
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
  const { data, isLoading } = useQuery(['single_events'], () => api.getEventByAdmin(params.slug), {
    onError: (err) => {
      toast.error(err.response.data.message || 'We ran into an issue. Please refresh the page or try again.');
    }
  });

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit Event"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Events',
            href: '/admin/events'
          },
          {
            name: data?.data?.title
          }
        ]}
      />
      <EditEvent data={data?.data} isLoading={isLoading} />
    </div>
  );
}
