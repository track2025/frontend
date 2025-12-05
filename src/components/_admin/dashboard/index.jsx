'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
// mui
import { Grid, Box, FormControl, Select, MenuItem, Chip } from '@mui/material';
// components
import DashboardCard from 'src/components/_admin/dashboard/dashboardCard';
import LowStockProducts from 'src/components/_admin/dashboard/lowStockProducts';
import OrderChart from 'src/components/charts/order';
import SaleChart from 'src/components/charts/sale';
import IncomeChart from 'src/components/charts/income';
import BestSelling from './bestSelling';
// icon
import { AiOutlineDollarCircle } from 'react-icons/ai';
import { PiUsersThree } from 'react-icons/pi';
import { BsShop } from 'react-icons/bs';
import { BiSolidShoppingBags } from 'react-icons/bi';
import { GrWorkshop } from 'react-icons/gr';
import { LuFileClock } from 'react-icons/lu';
import { FiFileText } from 'react-icons/fi';
import { LuFileInput } from 'react-icons/lu';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
import TimeFilter from './timeFilter';

Dashboard.propTypes = {
  isVendor: PropTypes.bool
};
export default function Dashboard({ isVendor }) {



    const [filterState, setFilterState] = useState({
    timeFilter: 'TODAY',
    dateRange: {
      startDate: null,
      endDate: null
    }
  })

  const handleFilterChange = (newFilter) => {
    // newFilter = { timeFilter, dateRange }
    setFilterState(newFilter)
  }




  
    // const [timeFilter, setTimeFilter] = useState('TODAY');

    console.log('filterState.dateRange::::',filterState.dateRange)



  const queryString = `startDate=${filterState.dateRange.startDate}&endDate=${filterState.dateRange.endDate}`;

const fetcher = isVendor
  ? api.vendorDashboardAnalytics
  : api.adminDashboardAnalytics;

const { data: dashboard, isLoading } = useQuery(
  ['brands', queryString],
  () => fetcher(queryString),
  {
    onError: (err) =>
      toast.error(
        err?.response?.data?.message ||
          'We ran into an issue. Please refresh the page or try again.'
      ),
  }
);



  



  const data = dashboard?.data || {};
  const daily_earning = data?.dailyEarning;
  const daily_orders = data?.dailyOrders;
  const daily_users = data?.totalUsers;
  const totalProducts = data?.totalProducts;
  const sales_report = data?.salesReport;
  const income_report = data?.incomeReport;
  const commission_report = data?.commissionReport;
  const orders_report = data?.ordersReport;
  const bestSellingProducts = data?.bestSellingProducts;
  const totalVendors = data?.totalVendors;
  const totalShops = data?.totalShops;
  const totalPendingOrders = data?.totalPendingOrders;
  const totalReturnOrders = data?.totalReturnOrders;

  // console.log('sales_report dashboard data:::', sales_report);

  // const handleTimeFilterChange = (newFilter) => {
  //   setTimeFilter(newFilter);
  // };




  return (
    <Box>
      <Grid container className="row">
        <Grid item xs={12} sm={6} md={3} className="col-md-3 col-sm-6 col-xs-12 mb-3">
          <DashboardCard
            color="primary"
            isAmount
            icon={<AiOutlineDollarCircle size={24} />}
            title="Daily Earnings"
            value={daily_earning}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} className="col-md-3 col-sm-6 col-xs-12 mb-3">
          <DashboardCard
            color="secondary"
            title="Daily Orders"
            value={daily_orders}
            icon={<FiFileText size={24} />}
            isLoading={isLoading}
          />
        </Grid>
        {!isVendor && (
          <Grid item xs={12} sm={6} md={3} className="col-md-3 col-sm-6 col-xs-12 mb-3">
            <DashboardCard
              color="warning"
              title="Total Users"
              value={daily_users}
              icon={<PiUsersThree size={30} />}
              isLoading={isLoading}
            />
          </Grid>
        )}

        <Grid
          item
          xs={12}
          sm={isVendor ? 12 : 6}
          md={3}
          className={`col-md-3 ${isVendor ? 'col-sm-12' : 'col-sm-6'} col-xs-12 mb-3`}
        >
          <DashboardCard
            color="error"
            title="Total Photos"
            value={totalProducts}
            icon={<BiSolidShoppingBags size={24} />}
            isLoading={isLoading}
          />
        </Grid>
        {!isVendor && (
          <Grid
            item
            xs={12}
            sm={isVendor ? 12 : 6}
            md={3}
            className={`col-md-3 ${isVendor ? 'col-sm-12' : 'col-sm-6'} col-xs-12 mb-3`}
          >
            <DashboardCard
              color="success"
              title="Approved Photographers"
              value={totalVendors}
              icon={<GrWorkshop size={24} />}
              isLoading={isLoading}
            />
          </Grid>
        )}
        {!isVendor && (
          <Grid
            item
            xs={12}
            sm={isVendor ? 12 : 6}
            md={3}
            className={`col-md-3 ${isVendor ? 'col-sm-12' : 'col-sm-6'} col-xs-12 mb-3`}
          >
            <DashboardCard
              color="info"
              title="Total # Photographers"
              value={totalShops}
              icon={<BsShop size={24} />}
              isLoading={isLoading}
            />
          </Grid>
        )}

        {/* <Grid item xs={12} sm={isVendor ? 12 : 6} md={3} className={`col-md-3 ${isVendor ? 'col-sm-12' : 'col-sm-6'} col-xs-12 mb-3`}>
          <DashboardCard
            color="#01838F"
            title="Pending Orders"
            value={totalPendingOrders}
            icon={<LuFileClock size={24} />}
            isLoading={isLoading}
          />
        </Grid> */}
        {/* {!isVendor && (
          <Grid item xs={12} sm={isVendor ? 12 : 6} md={3} className={`col-md-3 ${isVendor ? 'col-sm-12' : 'col-sm-6'} col-xs-12 mb-3`}>
            <DashboardCard
              color="#AFB42B"
              title="Retruned Orders"
              value={totalReturnOrders}
              icon={<LuFileInput size={24} />}
              isLoading={isLoading}
            />
          </Grid>
        )} */}

        {/* Filters */}
           <TimeFilter
        timeFilter={filterState.timeFilter}
        dateRange={filterState.dateRange}
        onChange={handleFilterChange}
      />
        {/* <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 3, mt: 2 }}>
          {['TODAY', 'ALL'].map((period) => (
            <Chip
              key={period}
              label={period}
              onClick={() => handleTimeFilterChange(period)}
              color={timeFilter === period ? 'primary' : 'default'}
              variant={timeFilter === period ? 'filled' : 'outlined'}
            />
          ))}

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={timeFilter.startsWith('WEEK_') ? timeFilter : ''}
              displayEmpty
              onChange={(e) => handleTimeFilterChange(e.target.value)}
              renderValue={(selected) => {
                if (!selected) return 'Select Week';
                const weekRange = selected.replace('WEEK_', '');
                return `Week: ${weekRange}`;
              }}
            >
              {['WEEK_Dec 18 - Dec 24', 'WEEK_Dec 11 - Dec 17', 'WEEK_Dec 4 - Dec 10', 'WEEK_Nov 27 - Dec 3'].map(
                (week) => (
                  <MenuItem key={week} value={week}>
                    {week.replace('WEEK_', '')}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={timeFilter.startsWith('MONTH_') ? timeFilter : ''}
              displayEmpty
              onChange={(e) => handleTimeFilterChange(e.target.value)}
              renderValue={(selected) => {
                if (!selected) return 'Select Month';
                const monthName = selected.replace('MONTH_', '');
                return monthName;
              }}
            >
              {[
                'MONTH_December 2024',
                'MONTH_November 2024',
                'MONTH_October 2024',
                'MONTH_September 2024',
                'MONTH_August 2024',
                'MONTH_July 2024'
              ].map((month) => (
                <MenuItem key={month} value={month}>
                  {month.replace('MONTH_', '')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box> */}

        <Grid item xs={12} md={12} lg={12} className="mb-3 w-100">
          <SaleChart data={sales_report} isLoading={isLoading} className="h-100" />
        </Grid>

        {/* <Grid item xs={12} md={5} lg={5} className="col-xs-12 mb-3 col-md-5 col-lg-5 ">
          <OrderChart data={orders_report} isLoading={isLoading} />
        </Grid> */}

        <Grid item xs={12} md={4} lg={4} className="col-xs-12 mb-3 col-md-4 col-lg-4">
          <BestSelling data={bestSellingProducts} loading={isLoading} isVendor={isVendor} />
        </Grid>

        <Grid item xs={12} md={8} lg={8} className="col-xs-12 mb-3 col-md-8 col-lg-8">
          <IncomeChart
            income={income_report}
            commission={commission_report}
            isVendor={isVendor}
            isLoading={isLoading}
          />
        </Grid>
        {/* <Grid item xs={12} className="col-xs-12 mb-3 col-md-12 col-lg-12">
          <LowStockProducts isVendor={isVendor} />
        </Grid> */}
      </Grid>
    </Box>
  );
}
