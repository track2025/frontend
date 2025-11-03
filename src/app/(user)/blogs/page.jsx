'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Alert, TextField, InputAdornment, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { getBlogs } from 'src/services/blogs';
import { BlogCard } from 'src/components/_main/blog/BlogCard';
import { BlogCardSkeleton } from 'src/components/_main/blog/BlogCardSkeleton';
import { BlogPagination } from 'src/components/_main/blog/BlogPagination';

export default function BlogsPage() {
  const searchParams = useSearchParams();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actualSearchTerm, setActualSearchTerm] = useState(''); // Track the search term used in API call
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 8
  });

  // Get page and search from URL on component mount and when URL changes
  useEffect(() => {
    const pageFromUrl = searchParams.get('page');
    const searchFromUrl = searchParams.get('search') || '';
    const pageNum = pageFromUrl && !isNaN(pageFromUrl) ? parseInt(pageFromUrl, 10) : 1;

    // Set search term from URL
    setSearchTerm(searchFromUrl);
    setActualSearchTerm(searchFromUrl); // Also set the actual search term

    // Only fetch if it's a valid page number
    if (pageNum > 0) {
      fetchBlogs(pageNum, searchFromUrl);

      // Update URL if no page parameter exists (always include page parameter for consistency)
      if (!pageFromUrl) {
        updateUrl(pageNum, searchFromUrl);
      }
    }
  }, [searchParams]);

  const updateUrl = (page, search) => {
    const params = new URLSearchParams();

    // Always include page parameter for consistency
    params.set('page', page.toString());

    if (search) {
      params.set('search', search);
    }

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', newUrl);
  };

  const fetchBlogs = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBlogs({
        limit: pagination.itemsPerPage,
        page: page,
        search: search
      });

      console.log('API Response:', response); // Debug log

      if (response.success) {
        setBlogPosts(response.data || []);
        setActualSearchTerm(search); // Update actual search term with what was used in API call

        setPagination((prev) => ({
          ...prev,
          currentPage: response.currentPage || page,
          totalPages: response.count || 1,
          totalItems: response.total || 0
        }));

        console.log('Pagination state:', {
          currentPage: response.currentPage || page,
          totalPages: response.count,
          totalItems: response.total,
          itemsPerPage: pagination.itemsPerPage,
          searchTerm: search
        });
      } else {
        setError('Failed to load blog posts');
        setBlogPosts([]);
        setActualSearchTerm(search); // Still update even on error
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err?.message || 'Unable to load blog posts. Please try again later.');
      setBlogPosts([]);
      setActualSearchTerm(search); // Still update even on error
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    updateUrl(newPage, searchTerm);
    // The useEffect will trigger because searchParams changed, which will call fetchBlogs
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    // Reset to page 1 when searching
    updateUrl(1, searchTerm);
    // The useEffect will trigger because searchParams changed, which will call fetchBlogs
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    // Reset to page 1 when clearing search
    updateUrl(1, '');
    // The useEffect will trigger because searchParams changed, which will call fetchBlogs
  };

  // Calculate showing range
  const startItem = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;
  const endItem = Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems);

  return (
    <>
      {/* SEO Meta Tags */}
      <title>Motorsport Photography Tips, Track-Day News & Tutorials | LapSnaps</title>
      <meta
        name="description"
        content="Explore the LapSnaps blog for motorsport photography tips, track day guides, gear reviews, and tutorials. Learn from professional photographers and enthusiasts."
      />
      <meta
        name="keywords"
        content="motorsport photography, track day tips, racing photography, camera settings, photography tutorials, motorsport blog"
      />
      <link rel="canonical" href="https://lapsnaps.com/blogs" />

      <Box sx={{ minHeight: '100vh', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="xl">
          {/* H1 Heading */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.8rem' },
              fontWeight: 800,
              textAlign: 'center',
              mb: 2
            }}
          >
            LapSnaps Blog – Motorsport Photography & Track-Day Insights
          </Typography>

          {/* H2 Subheading */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              fontWeight: 400,
              textAlign: 'center',
              mb: 6,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Expert tips, tutorials, and insights for motorsport photographers and track day enthusiasts
          </Typography>

          {/* Search Bar */}
          <Paper
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              // p: 1,
              borderRadius: '28px', // Fully rounded corners
              background: 'transparent'
            }}
          >
            <TextField
              fullWidth
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton aria-label="clear search" onClick={handleClearSearch} edge="end" size="small">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '24px' // Fully rounded corners for the input
                }
              }}
            />
          </Paper>

          {/* Error state */}
          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {/* Results Count - Show when we have results and only one page */}
          {!loading && blogPosts.length > 0 && pagination.totalPages === 1 && (
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                textAlign: 'center',
                mb: 3
              }}
            >
              {actualSearchTerm
                ? `Found ${pagination.totalItems} result${pagination.totalItems !== 1 ? 's' : ''} for "${actualSearchTerm}"`
                : `Showing ${startItem}-${endItem} of ${pagination.totalItems} blog posts`}
            </Typography>
          )}

          {/* Blog Posts Grid */}
          <Grid container spacing={4}>
            {loading ? (
              Array.from(new Array(pagination.itemsPerPage)).map((_, index) => (
                <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={`skeleton-${index}`}>
                  <BlogCardSkeleton />
                </Grid>
              ))
            ) : blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={post._id}>
                  <BlogCard post={post} />
                </Grid>
              ))
            ) : (
              <Grid item size={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h5" sx={{ color: '#666', mb: 2 }}>
                    {actualSearchTerm ? 'No blog posts found matching your search' : 'No blog posts found'}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#999' }}>
                    {actualSearchTerm ? 'Try adjusting your search terms' : 'Check back later for new content!'}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Pagination - Only show if we have multiple pages and not loading */}
          {!loading && pagination.totalPages > 1 && (
            <BlogPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </Container>
      </Box>
    </>
  );
}
