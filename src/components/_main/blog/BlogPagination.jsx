'use client';
import { Box, Pagination, Typography } from '@mui/material';

export const BlogPagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 6 }}>
      {/* Results Count */}
      <Typography variant="body2" sx={{ color: '#666' }}>
        Showing {startItem}-{endItem} of {totalItems} results
      </Typography>

      {/* Pagination Controls */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={onPageChange}
        color="primary"
        size="large"
        sx={{
          '& .MuiPaginationItem-root': {
            fontWeight: 600,
            fontSize: '0.9rem'
          },
          '& .MuiPaginationItem-page.Mui-selected': {
            backgroundColor: '#EE1E50',
            color: 'white',
            '&:hover': {
              backgroundColor: '#d81b47'
            }
          }
        }}
      />
    </Box>
  );
};
