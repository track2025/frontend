import React from 'react';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddCouponCode from 'src/components/_admin/couponCodes/addCouponCode';
export default function page() {
  return (
    <div>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Coupon Code List"
          links={[
            {
              name: 'Dashboard',
              href: '/admin'
            },
            {
              name: 'Coupon code',
              href: '/admin/coupon-code'
            },
            {
              name: 'Add coupon code'
            }
          ]}
        />
      </Toolbar>
      <AddCouponCode />
    </div>
  );
}
