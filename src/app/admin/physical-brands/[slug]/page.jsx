'use client';
import React, { use } from 'react';
import PropTypes from 'prop-types';

// components
import EditBrand from 'src/components/_admin/physical-brands/edit-brand';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// api
import { useQuery } from 'react-query';
import * as api from 'src/services';

Page.propTypes = { params: PropTypes.shape({ slug: PropTypes.string.isRequired }).isRequired };

export default function Page({params}) {
  const {slug} = params;

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['coupon-codes', slug],
    queryFn: () => api.getPhysicalBrandByAdmin(slug)
  });
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Brands"
        links={[
          { name: 'Dashboard', href: '/admin' },
          { name: 'Brands', href: '/admin/physical-brands' },
          { name: 'Edit Brand' }
        ]}
      />

      <EditBrand data={data?.data} isLoading={isLoading} />
    </div>
  );
}
