// /components/_main/blog/BlogPostSkeleton.js
'use client';
import { Box, Container, Skeleton, Breadcrumbs, Button } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const BlogPostSkeleton = () => {
  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Image Skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={{ xs: 300, sm: 400, md: 500 }}
        sx={{ bgcolor: 'grey.200' }}
      />

      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Breadcrumbs Skeleton */}
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
          <Skeleton variant="text" width={60} height={24} sx={{ bgcolor: 'grey.200' }} />
          <Skeleton variant="text" width={120} height={24} sx={{ bgcolor: 'grey.200' }} />
        </Breadcrumbs>

        {/* Back Button Skeleton */}
        <Button startIcon={<ArrowBackIcon />} disabled sx={{ mb: 3, color: 'transparent' }}>
          <Skeleton variant="text" width={120} height={24} sx={{ bgcolor: 'grey.200' }} />
        </Button>

        {/* Article Header Skeleton */}
        <Box sx={{ bgcolor: 'white', p: { xs: 3, md: 5 }, borderRadius: 2, boxShadow: 2, mb: 4 }}>
          {/* Category Skeleton */}
          <Skeleton variant="rounded" width={80} height={24} sx={{ mb: 2, bgcolor: 'grey.200' }} />

          {/* Title Skeleton */}
          <Skeleton variant="text" height={32} sx={{ mb: 1, bgcolor: 'grey.200' }} />
          <Skeleton variant="text" height={32} width="90%" sx={{ mb: 3, bgcolor: 'grey.200' }} />

          {/* Meta Info Skeleton */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'grey.200' }} />
              <Skeleton variant="text" width={80} height={20} sx={{ bgcolor: 'grey.200' }} />
            </Box>
            <Skeleton variant="text" width={100} height={20} sx={{ bgcolor: 'grey.200' }} />
            <Skeleton variant="text" width={60} height={20} sx={{ bgcolor: 'grey.200' }} />
          </Box>
        </Box>

        {/* Article Content Skeleton */}
        <Box sx={{ bgcolor: 'white', p: { xs: 3, md: 5 }, borderRadius: 2, boxShadow: 2 }}>
          <Skeleton variant="text" height={28} sx={{ mb: 2, bgcolor: 'grey.200' }} />
          <Skeleton variant="text" height={20} sx={{ mb: 1, bgcolor: 'grey.200' }} />
          <Skeleton variant="text" height={20} sx={{ mb: 1, bgcolor: 'grey.200' }} />
          <Skeleton variant="text" height={20} width="80%" sx={{ mb: 3, bgcolor: 'grey.200' }} />

          <Skeleton variant="text" height={28} sx={{ mb: 2, bgcolor: 'grey.200' }} />
          <Skeleton variant="text" height={20} sx={{ mb: 1, bgcolor: 'grey.200' }} />
          <Skeleton variant="text" height={20} width="70%" sx={{ mb: 1, bgcolor: 'grey.200' }} />
          <Skeleton variant="text" height={20} width="90%" sx={{ mb: 3, bgcolor: 'grey.200' }} />

          <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 3, bgcolor: 'grey.200' }} />
        </Box>
      </Container>
    </Box>
  );
};
