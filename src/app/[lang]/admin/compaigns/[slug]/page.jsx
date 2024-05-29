'use client';
import React from 'react';
// Toolbar
import Toolbar from 'src/components/_admin/toolbar';
// Breadcrumbs
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
// components
import EditCompaign from 'src/components/_admin/compaigns/editCompaign';
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
export default function Page({ params }) {
  const { data, isLoading } = useQuery(['get-admin-compaign'], () => api.getCompaignByAdmin(params.slug), {
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong!');
    }
  });
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Currency List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Currencies',
            href: '/admin/currencies'
          },
          {
            name: 'Add currency'
          }
        ]}
      />
      <EditCompaign isLoading={isLoading} data={data?.data} />
    </div>
  );
}
