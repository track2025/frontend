import React from 'react';
// mui
import { Box, Card, Table, TableBody, TableContainer, Stack } from '@mui/material';
// components
import NotFound from 'src/components/illustrations/noDataFound';
import Pagination from 'src/components/pagination';

import PropTypes from 'prop-types';
import Search from 'src/components/search';
import TableHead from './tableHead';

CustomTable.propTypes = {
  headData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      alignRight: PropTypes.bool
    })
  ).isRequired,
  data: PropTypes.shape({
    data: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isDashboard: PropTypes.bool,
  mobileRow: PropTypes.elementType,
  row: PropTypes.elementType.isRequired,
  filters: PropTypes.any,
  isSearch: PropTypes.bool
};

export default function CustomTable({ ...props }) {
  const { headData, data, isLoading, isDashboard, isSearch, row, filters, ...rest } = props;
  // mobileRow,
  const Component = row;
  // const CardComponent = mobileRow;
  return (
    <Card>
      {!isLoading && data?.data?.length === 0 ? (
        <NotFound title="No Order Found" />
      ) : (
        <>
          <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
            {isSearch ? <Search /> : null} {filters}
          </Stack>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table size="small" sx={{ minWidth: 650 }} stickyHeader>
              <TableHead headData={headData} />
              <TableBody>
                {(isLoading ? Array.from(new Array(6)) : data?.data).map((item) => {
                  return <Component key={Math.random()} row={item} isLoading={isLoading} {...rest} />;
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {!isLoading && (
            <Stack alignItems="flex-end" mt={2} pr={2}>
              <Pagination data={data} />
            </Stack>
          )}
        </>
      )}
    </Card>
  );
}
