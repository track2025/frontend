'use client';
import { Card, CardContent, Skeleton, Box } from '@mui/material';

export const TrackCardSkeleton = () => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'visible'
      }}
    >
      {/* Image Skeleton */}
      <Skeleton variant="rectangular" width="100%" height={200} sx={{ bgcolor: 'grey.200' }} />

      <CardContent
        sx={{
          p: 2,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        {/* Title Skeleton */}
        <Skeleton variant="text" height={24} sx={{ mb: 1, bgcolor: 'grey.200' }} />

        {/* Location Skeleton */}
        <Skeleton variant="text" width="80%" height={16} sx={{ mb: 1, mx: 'auto', bgcolor: 'grey.200' }} />

        {/* Track Info Skeleton */}
        <Skeleton variant="text" width="60%" height={14} sx={{ mb: 0.5, mx: 'auto', bgcolor: 'grey.200' }} />
        <Skeleton variant="text" width="40%" height={12} sx={{ mb: 1, mx: 'auto', bgcolor: 'grey.200' }} />

        {/* Facilities Skeleton */}
        <Skeleton variant="text" width="70%" height={12} sx={{ mx: 'auto', bgcolor: 'grey.200' }} />
      </CardContent>
    </Card>
  );
};
