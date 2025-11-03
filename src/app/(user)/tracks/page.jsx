'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Typography, Box, Container, Grid, Alert, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { getTracks } from 'src/services/tracks';
import { TrackCardCompact, TrackCardCompactSkeleton } from 'src/components/_main/track/TrackCardCompact';
import { BlogPagination } from 'src/components/_main/blog/BlogPagination';

export default function TracksPage() {
  const searchParams = useSearchParams();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 100
  });

  // Get page and search from URL on component mount and when URL changes
  useEffect(() => {
    const pageFromUrl = searchParams.get('page');
    const searchFromUrl = searchParams.get('search') || '';
    const pageNum = pageFromUrl && !isNaN(pageFromUrl) ? parseInt(pageFromUrl, 10) : 1;

    // Set search term from URL
    setSearchTerm(searchFromUrl);

    // Only fetch if it's a valid page number
    if (pageNum > 0) {
      fetchTracks(pageNum, searchFromUrl);

      // Update URL if no page parameter exists
      if (!pageFromUrl) {
        const params = new URLSearchParams();
        if (searchFromUrl) {
          params.set('search', searchFromUrl);
        }
        params.set('page', pageNum.toString());
        const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
        window.history.replaceState(null, '', newUrl);
      }
    }
  }, [searchParams]);

  const fetchTracks = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTracks({
        limit: pagination.itemsPerPage,
        page: page,
        search: search
      });

      if (response.success) {
        setTracks(response.data || []);
        setPagination((prev) => ({
          ...prev,
          currentPage: response.currentPage || page,
          totalPages: response.count || 1,
          totalItems: response.total || 0
        }));
      } else {
        setError('Failed to load tracks');
        setTracks([]);
      }
    } catch (err) {
      console.error('Error fetching tracks:', err);
      setError('Unable to load tracks. Please try again later.');
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    // Update URL with the search parameter first, then page
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    params.set('page', newPage.toString());
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', newUrl);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    // Reset to page 1 when searching
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    }
    params.set('page', '1');
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', newUrl);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    // Reset to page 1 when clearing search
    const params = new URLSearchParams();
    params.set('page', '1');
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', newUrl);
  };

  // Safe structured data generation
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Car, Bike & Kart Race Tracks Worldwide',
    description:
      'Explore car, bike & kart circuits from around the world. Browse iconic race tracks including Silverstone, Spa-Francorchamps, Nürburgring and more.',
    url: 'https://lapsnaps.com/tracks',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: tracks.map((track, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Place',
          '@id': `https://lapsnaps.com/tracks/${track.slug || track._id}`,
          name: track.name || 'Unknown Track',
          description: track.description || '',
          ...(track.city &&
            track.country && {
              address: {
                '@type': 'PostalAddress',
                addressLocality: track.city,
                addressCountry: track.country
              }
            })
        }
      }))
    }
  };

  const startItem = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;
  const endItem = Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems);

  return (
    <>
      <title>Car, Bike & Kart Race Tracks Worldwide | LapSnaps</title>
      <meta
        name="description"
        content="Explore car, bike & kart circuits from around the world. Browse iconic race tracks including Silverstone, Spa-Francorchamps, Nürburgring, Bedford Autodrome, Yas Marina, and more. Find track days and motorsport events."
      />
      <meta
        name="keywords"
        content="race tracks, motorsport circuits, car racing, bike racing, kart racing, track days, silverstone, spa francorchamps, nurburgring, yas marina, dubai autodrome, bedford autodrome, brands hatch, racing circuits worldwide"
      />
      <link rel="canonical" href="https://lapsnaps.com/tracks" />

      <meta property="og:title" content="Car, Bike & Kart Race Tracks Worldwide | LapSnaps" />
      <meta
        property="og:description"
        content="Explore car, bike & kart circuits from around the world. Browse iconic race tracks and find track days."
      />
      <meta property="og:url" content="https://lapsnaps.com/tracks" />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Car, Bike & Kart Race Tracks Worldwide | LapSnaps" />
      <meta name="twitter:description" content="Explore car, bike & kart circuits from around the world." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Box sx={{ minHeight: '100vh', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="xl">
          {/* H1 Heading */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.3rem' },
              fontWeight: 800,
              // color: '#1a1a1a',
              textAlign: 'center',
              mb: 1
            }}
          >
            All Race Tracks on LapSnaps
          </Typography>

          {/* H2 Subheading */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              fontWeight: 400,
              color: '#666',
              textAlign: 'center',
              mb: 3,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Explore Car, Bike & Kart Circuits from Around the World
          </Typography>

          {/* Search Input */}
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              maxWidth: 700,
              mx: 'auto',
              mb: 4
            }}
          >
            <TextField
              fullWidth
              placeholder="Search tracks by name, city, or country..."
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
                  borderRadius: 3,
                  // backgroundColor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#666'
                  }
                  // '&:hover .MuiOutlinedInput-notchedOutline': {
                  //   borderColor: '#bdbdbd'
                  // }
                }
              }}
            />
          </Box>

          {/* Error state */}
          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          <Typography
            variant="body2"
            sx={{
              color: '#666',
              textAlign: 'center',
              width: '100%',
              mb: 2
            }}
          >
            Showing {startItem}-{endItem} of {pagination.totalItems} results
          </Typography>

          {/* Tracks Grid - Using compact layout similar to Brands component */}
          <Grid container spacing={2} justifyContent="center">
            {loading ? (
              // Skeleton loading state
              Array.from(new Array(pagination.itemsPerPage)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
                  <TrackCardCompactSkeleton index={index} />
                </Grid>
              ))
            ) : tracks.length > 0 ? (
              // Actual tracks with compact layout

              tracks.map((track) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={track._id}>
                  <TrackCardCompact track={track} />
                </Grid>
              ))
            ) : (
              // Empty state
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h5" sx={{ color: '#666', mb: 2 }}>
                    {searchTerm ? 'No tracks found matching your search' : 'No tracks found'}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#999' }}>
                    {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new tracks!'}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Pagination - Only show if we have multiple pages and not loading */}
          {!loading && pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <BlogPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
