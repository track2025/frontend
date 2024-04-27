'use client';
import React from 'react';

// toast
import toast from 'react-hot-toast';
// components
import DashboardCard from 'src/components/_admin/dashboard/dashboardCard';
import LowStockProducts from 'src/components/_admin/dashboard/lowStockProducts';
// icon
import { FaFileInvoiceDollar } from 'react-icons/fa6';
import { BsClipboard2DataFill } from 'react-icons/bs';
import OrderChart from 'src/components/charts/Order';
import SalesChart from 'src/components/charts/Sales';
import IncomeChart from 'src/components/charts/Income';
import BestSelling from './bestSelling';
// mui
import { Grid, Box, Typography, Card } from '@mui/material';
// react-query
import { useQuery } from 'react-query';
// api
import * as api from 'src/services';
import PropTypes from 'prop-types';
Dashboard.propTypes = {
  isVendor: PropTypes.bool
};
export default function Dashboard({ isVendor }) {
  const { data: dashboard, isLoading } = useQuery(
    'dashboard-analytics',
    api[isVendor ? 'vendorAnalytics' : 'dashboardAnalytics'],
    {
      refetchInterval: 10000,
      onError: (error) => toast.error(error.message || 'Something went wrong!')
    }
  );
  const data = dashboard?.data || {};
  const daily_earning = data?.dailyEarning;
  const daily_orders = data?.dailyOrders;
  const daily_users = data?.totalUsers;
  const totalProducts = data?.totalProducts;
  const sales_report = data?.salesReport;
  const income_report = data?.incomeReport;
  const orders_report = data?.ordersReport;
  const bestSellingProducts = data?.bestSellingProducts;
  const totalVendors = data?.totalVendors;
  const totalShops = data?.totalShops;
  const totalPendingOrders = data?.totalPendingOrders;
  const totalReturnOrders = data?.totalReturnOrders;

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            color="primary"
            isAmount
            icon={<FaFileInvoiceDollar size={24} />}
            title="Daily Earning"
            value={daily_earning}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            color="secondary"
            title="Daily Orders"
            value={daily_orders}
            icon={<BsClipboard2DataFill size={24} />}
            isLoading={isLoading}
          />
        </Grid>
        {!isVendor && (
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              color="warning"
              title="Total Users"
              value={daily_users}
              icon={<BsClipboard2DataFill size={24} />}
              isLoading={isLoading}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={isVendor ? 12 : 6} md={3}>
          <DashboardCard
            color="error"
            title="Total Products"
            value={totalProducts}
            icon={<BsClipboard2DataFill size={24} />}
            isLoading={isLoading}
          />
        </Grid>
        {!isVendor && (
          <Grid item xs={12} sm={isVendor ? 12 : 6} md={3}>
            <DashboardCard
              color="success"
              title="Total Vendors"
              value={totalVendors}
              icon={<BsClipboard2DataFill size={24} />}
              isLoading={isLoading}
            />
          </Grid>
        )}
        {!isVendor && (
          <Grid item xs={12} sm={isVendor ? 12 : 6} md={3}>
            <DashboardCard
              color="info"
              title="Total Shop"
              value={totalShops}
              icon={<BsClipboard2DataFill size={24} />}
              isLoading={isLoading}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={isVendor ? 12 : 6} md={3}>
          <DashboardCard
            color="#01838F"
            title="Pending Orders"
            value={totalPendingOrders}
            icon={<BsClipboard2DataFill size={24} />}
            isLoading={isLoading}
          />
        </Grid>
        {!isVendor && (
          <Grid item xs={12} sm={isVendor ? 12 : 6} md={3}>
            <DashboardCard
              color="#AFB42B"
              title="Retruned Orders"
              value={totalReturnOrders}
              icon={<BsClipboard2DataFill size={24} />}
              isLoading={isLoading}
            />
          </Grid>
        )}

        <Grid item xs={12} md={7} lg={7}>
          <SalesChart data={sales_report} isLoading={isLoading} />
        </Grid>
        <Grid item xs={12} md={5} lg={5}>
          <OrderChart data={orders_report} isLoading={isLoading} />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <BestSelling data={bestSellingProducts} loading={isLoading} isVendor={isVendor} />
        </Grid>
        <Grid item xs={12} md={8} lg={8}>
          <IncomeChart data={income_report} isLoading={isLoading} />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <Typography variant="h6" color="text.primary" px={2} py={2}>
              Low Stock Products
            </Typography>
            <LowStockProducts isVendor={isVendor} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
