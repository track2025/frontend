'use client';
import { Card, CardContent, Skeleton, Box } from '@mui/material';

export const BlogCardSkeleton = () => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      {/* Image Skeleton Container */}
      <Box
        sx={{
          width: '100%',
          height: 220,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Skeleton variant="rectangular" width="100%" height="100%" sx={{ bgcolor: 'grey.200' }} />
      </Box>

      <CardContent
        sx={{
          p: 3,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}
      >
        {/* Category Chip Skeleton */}
        <Skeleton variant="rounded" width={80} height={24} sx={{ mb: 2, bgcolor: 'grey.200' }} />

        {/* Title Skeleton */}
        <Skeleton variant="text" height={32} sx={{ mb: 1, bgcolor: 'grey.200' }} />
        <Skeleton variant="text" height={32} width="80%" sx={{ mb: 2, bgcolor: 'grey.200' }} />

        {/* Excerpt Skeleton */}
        <Skeleton variant="text" height={20} sx={{ mb: 1, bgcolor: 'grey.200' }} />
        <Skeleton variant="text" height={20} sx={{ mb: 1, bgcolor: 'grey.200' }} />
        <Skeleton variant="text" height={20} width="60%" sx={{ mb: 3, bgcolor: 'grey.200' }} />

        {/* Meta Info Skeleton */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 2,
            borderTop: '1px solid #e0e0e0'
          }}
        >
          <Skeleton variant="text" width={60} height={20} sx={{ bgcolor: 'grey.200' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Skeleton variant="circular" width={14} height={14} sx={{ bgcolor: 'grey.200' }} />
            <Skeleton variant="text" width={40} height={20} sx={{ bgcolor: 'grey.200' }} />
          </Box>
        </Box>

        {/* Date Skeleton */}
        <Skeleton variant="text" width={100} height={16} sx={{ mt: 1, bgcolor: 'grey.200' }} />

        {/* Read More Skeleton */}
        <Skeleton variant="text" width={80} height={20} sx={{ mt: 2, bgcolor: 'grey.200' }} />
      </CardContent>
    </Card>
  );
};
