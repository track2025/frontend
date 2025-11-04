'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Divider,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  IconButton,
  CardActionArea
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import ClearIcon from '@mui/icons-material/Clear';
import { getProducts } from 'src/services';
import { getTrackEventsByTrackSlug } from 'src/services/tracks';
import ProductList from '../../_main/products/productList';
import { BlogPagination } from 'src/components/_main/blog/BlogPagination';
import SortBar from 'src/components/_main/products/sortbar';
import { alpha, useTheme } from '@mui/material/styles';

export default function TrackDetailsClient({ track }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const params = useParams();
  const searchParams = useSearchParams();
  const { rate } = useSelector(({ settings }) => settings);

  // Create a ref for the products section
  const productsSectionRef = useRef(null);


  const slug = params.slug;

  // Get page and search from URL on component mount and when URL changes
  useEffect(() => {
    const pageFromUrl = searchParams.get('page');
    const searchFromUrl = searchParams.get('search');

    // Set search query from URL
    if (searchFromUrl !== null) {
      setSearchQuery(searchFromUrl);
    }

    // Set page from URL
    if (pageFromUrl && !isNaN(pageFromUrl)) {
      const pageNum = parseInt(pageFromUrl, 10);
      if (pageNum > 0 && pageNum !== currentPage) {
        setCurrentPage(pageNum);
      }
    } else {
      // If no page parameter in URL, set it to page 1 and update URL
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState(null, '', newUrl);
    }
  }, [searchParams, currentPage]);

  // Create a stable query key that doesn't include circular references
  const queryKey = `track-products-${slug}-${rate}-${currentPage}-${itemsPerPage}-${searchQuery}`;

  const getSearchParams = (searchParams) => {
    return searchParams.toString().length ? '?' + searchParams.toString() : '';
  };

  const _searchQuery = getSearchParams(searchParams);


  // Fetch products on client side
  const { data: productsData, isLoading: productsLoading } = useQuery(
    _searchQuery,
    () => {
      const queryParams = new URLSearchParams();
      queryParams.append('location', track.name);
      queryParams.append('page', currentPage.toString());
      queryParams.append('limit', itemsPerPage.toString());
      queryParams.append('date', 1);

      // Add search parameter if search query exists
      if (searchQuery.trim()) {
        queryParams.append('search', searchQuery.trim());
      }

      if (rate) {
        queryParams.append('rate', rate);
      }

      const queryString = `?${queryParams.toString()}`;

      console.log('query string :::::::::', queryString);
      // return getProducts(queryString);
      return getProducts(queryString);
    },
    {
      enabled: !!slug,
      staleTime: 5 * 60 * 1000
    }
  );

  // Fetch events for this track
  const { data: eventsData, isLoading: eventsLoading } = useQuery(
    `track-events-${slug}`,
    () => getTrackEventsByTrackSlug(slug),
    {
      enabled: !!slug,
      staleTime: 5 * 60 * 1000
    }
  );

  console.log({ productsData, eventsData });

  // Extract products and pagination data from response
  const products = productsData?.data || [];
  const paginationInfo = productsData || {};

  // Extract events data
  const upcomingEvents = eventsData?.data || [];

  // Use the same pagination structure as blogs
  const pagination = {
    currentPage: paginationInfo.currentPage || currentPage,
    totalPages: paginationInfo.count || Math.ceil((paginationInfo.total || 0) / itemsPerPage),
    totalItems: paginationInfo.total || 0,
    itemsPerPage: itemsPerPage
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Update URL with search parameter
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set('search', value.trim());
    } else {
      params.delete('search');
    }

    // Reset to page 1 when searching
    params.set('page', '1');
    setCurrentPage(1);

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', newUrl);
  };

  // Handle search submit (when user presses enter)
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      // Scroll to products section when searching
      if (productsSectionRef.current) {
        productsSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');

    // Update URL - remove search parameter
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.set('page', '1');
    setCurrentPage(1);

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', newUrl);

    // Scroll to products section
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Handle page change - update URL and scroll to products section
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);

    // Update URL with the new page parameter
    const params = new URLSearchParams(searchParams.toString());

    // Always set the page parameter, even for page 1
    params.set('page', newPage.toString());

    // Construct the new URL with all existing query parameters
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;

    // Use replaceState to update URL without refreshing the page
    window.history.replaceState(null, '', newUrl);

    // Scroll to the top of the products section
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Safe data access with fallbacks
  const trackName = track.name || 'Unknown Track';
  const trackCity = track.city || 'Unknown City';
  const trackCountry = track.country || 'Unknown Country';
  const trackDescription = track.fullDescription || track.description || 'No description available.';
  const trackLength = track.length || 'N/A';
  const trackCorners = track.corners || 'N/A';
  const trackAddress = track.address || '';
  const trackRegion = track.region || '';

  // Image URLs with fallbacks
  const defaultBannerUrl =
    'https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,f_jpg,h_465,q_65,w_640/v1/crm/virginia/25RIC2CJ_07968_DC74D7F8-03B1-4525-AEB8CE9364DD4AFA_2f960371-6458-4eac-8ba0591de4c5f106.jpg';
  const bannerImage = track.bannerImage?.url || track.thumbnailImage?.url || defaultBannerUrl;
  const logoImage = track.logo?.url || null;

  // Arrays with fallbacks
  const trackFacilities = track.facilities || [];
  const trackFaqs = track.faqs || [];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `https://lapsnaps.com/tracks/${track.slug}`,
    name: trackName,
    description: trackDescription,
    url: `https://lapsnaps.com/tracks/${track.slug}`,
    image: bannerImage,
    ...(trackAddress && {
      address: {
        '@type': 'PostalAddress',
        ...(trackAddress && { streetAddress: trackAddress }),
        addressLocality: trackCity,
        ...(trackRegion && { addressRegion: trackRegion }),
        addressCountry: trackCountry
      }
    }),
    ...(track.phone && { telephone: track.phone }),
    ...(track.email && { email: track.email }),
    ...(track.website && { sameAs: [track.website] })
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: trackFaqs.map((faq, index) => ({
      '@type': 'Question',
      name: faq.question || `Question ${index + 1}`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer || 'No answer available.'
      }
    }))
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://lapsnaps.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tracks',
        item: 'https://lapsnaps.com/tracks'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: trackName,
        item: `https://lapsnaps.com/tracks/${track.slug}`
      }
    ]
  };
  const sortData = [
    // { title: 'Top Rated', key: 'top', value: -1 },
    { title: 'Price low to high', key: 'price', value: 1 },
    { title: 'Price high to low', key: 'price', value: -1 },
    { title: 'Oldest', key: 'date', value: 1 },
    { title: 'Newest', key: 'date', value: -1 }
  ];

  const theme = useTheme();

  return (
    <>
      {/* Structured Data for SEO */}
      {/* <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {trackFaqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      /> */}

      <Box sx={{ minHeight: '100vh', bgcolor: (theme) => (theme.palette.mode !== 'dark' ? '#fff' : '#000') }}>
        {/* Breadcrumbs */}
        {/* <Container maxWidth="xl" sx={{ pt: 3 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <MuiLink underline="hover" color="inherit" href="/" sx={{ cursor: 'pointer' }}>
              Home
            </MuiLink>
            <MuiLink underline="hover" color="inherit" href="/tracks" sx={{ cursor: 'pointer' }}>
              Tracks
            </MuiLink>
            <Typography color="text.primary">{trackName}</Typography>
          </Breadcrumbs>
        </Container> */}

        {/* Banner Section */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: 300, sm: 400, md: 500 },
            bgcolor: '#000',
            overflow: 'hidden',
            mt: 0
          }}
        >

<div style={{
  position: "absolute",
  top: 10,
  left: 20,
  zIndex: 100
}}>
<Container maxWidth="xl" sx={{ pt: 3 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <MuiLink underline="hover" color="#bbb" href="/" sx={{ cursor: 'pointer' }}>
              Home
            </MuiLink>
            <MuiLink underline="hover" color="#bbb" href="/tracks" sx={{ cursor: 'pointer' }}>
              Tracks
            </MuiLink>
            <Typography color="#fff">{trackName}</Typography>
          </Breadcrumbs>
        </Container>
</div>


          <Box
            component="img"
            src={bannerImage}
            alt={`${trackName} - ${trackCity}, ${trackCountry}`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.8
            }}
            onError={(e) => {
              e.target.src = defaultBannerUrl;
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%)'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              px: 2
            }}
          >




            {/* Logo */}
            {logoImage && (
              <Box
                sx={{
                  width: { xs: 100, sm: 120, md: 140 },
                  height: { xs: 100, sm: 120, md: 140 },
                  margin: '0 auto 20px',
                  bgcolor: 'white',
                  borderRadius: '50%',
                  p: 2,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box
                  component="img"
                  src={logoImage}
                  alt={`${trackName} logo`}
                  sx={{
                    width: '85%',
                    height: '85%',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.display = 'none';
                  }}
                />
              </Box>
            )}

            {/* Track Name */}
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                fontWeight: 800,
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                mb: 1
              }}
            >
              {trackName}
            </Typography>

            {/* Location and Track Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnIcon sx={{ color: 'white', fontSize: 20 }} />
                <Typography sx={{ color: 'white', fontSize: '1.1rem' }}>
                  {trackCity}, {trackCountry}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <SpeedIcon sx={{ color: 'white', fontSize: 20 }} />
                <Typography sx={{ color: 'white', fontSize: '1.1rem' }}>
                  {trackLength} • {trackCorners} Corners
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: { xs: 7, md: 6 }, px: { xs: 4, md: 7 } }}>
          {/* Description */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 700,
                // color: '#1a1a1a',
                mb: 2
                // color: theme.palette.secondary.main
              }}
            >
              About {trackName}
            </Typography>
            <Typography
              sx={{
                fontSize: '16px',
                lineHeight: 1.7,
                // color: '#333',
                // color: theme.palette.secondary.main,

                mb: 2,
                whiteSpace: 'pre-line'
              }}
            >
              {trackDescription}
            </Typography>
          </Box>

          {/* Two Column Grid */}
          <Grid container spacing={4}>
            {/* Left Column - Products Gallery & Search */}
            <Grid item size={{ xs: 12, lg: 8 }}>
              {/* Products Section with ref for scrolling */}
              <Box ref={productsSectionRef}>
                {/* Search Section - Sticky */}
                <Box
                  sx={{
                    mb: 4,
                    position: { lg: 'sticky' },
                    top: { lg: 76 },
                    zIndex: 10,
                    // bgcolor: '#f8f9fa',
                    bgcolor: theme.palette.mode !== 'dark' ? '#fff' : '#000',
                    // bgcolor: 'red',
                    py: 2
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      // color: '#1a1a1a',
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      mb: 2
                    }}
                  >
                    Track Products & Gallery
                  </Typography>
                  <SortBar sortData={sortData} productData={products} showLocationSearch={false} />
                </Box>

                {/* Products Grid */}
                {productsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress sx={{ color: '#EE1E50' }} />
                  </Box>
                ) : products.length > 0 ? (
                  <Box style={{
                    marginTop: -20
                  }}>
                    {/* Product List */}
                    <ProductList data={{ data: products }} isLoading={false} isMobile={false} />

                    {/* Pagination - Using the same BlogPagination component */}
                    {!productsLoading && pagination.totalPages > 1 && (
                      <BlogPagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        itemsPerPage={pagination.itemsPerPage}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6, borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {searchQuery ? `No products found for "${searchQuery}"` : 'No products available for this track'}
                    </Typography>
                    <Typography variant="caption">
                      {searchQuery ? 'Try adjusting your search terms' : 'Check back later for track-related products'}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Right Column - Events */}
            <Grid item size={{ xs: 12, lg: 4 }}>
              <Card
                sx={{
                  // bgcolor: 'white',
                  boxShadow: 3,
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  position: { lg: 'sticky' },
                  top: { lg: 80 }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <EventIcon sx={{ color: '#EE1E50', fontSize: 28 }} />
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.25rem'
                        // color: '#1a1a1a'
                      }}
                    >
                      Upcoming Events
                    </Typography>
                  </Box>

                  {eventsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                      <CircularProgress size={24} sx={{ color: '#EE1E50' }} />
                    </Box>
                  ) : upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event, index) => (
                      <Box key={event._id || index}>
                        <CardActionArea
                          component={Link}
                          href={`/tracks/${track.slug}/events/${event.slug}`}
                          sx={{
                            py: 2.5,
                            px: 1,
                            borderRadius: 1,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: '#f8f9fa07',
                              transform: 'translateX(4px)'
                            }
                          }}
                        >
                          <Chip
                            label={event.category || 'Event'}
                            size="small"
                            sx={{
                              bgcolor: '#EE1E50',
                              color: 'white',
                              fontWeight: 600,
                              mb: 1.5
                            }}
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              mb: 1.5,
                              fontSize: '1rem',
                              lineHeight: 1.3
                            }}
                          >
                            {event.title || 'Upcoming Event'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayIcon sx={{ fontSize: 16 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {event.date ? formatDate(event.date) : 'Date TBA'}
                            </Typography>
                          </Box>
                          {event.startTime && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                              {event.startTime} {event.endTime && `- ${event.endTime}`}
                            </Typography>
                          )}
                        </CardActionArea>
                        {index < upcomingEvents.length - 1 && (
                          <Divider
                            sx={{
                              borderColor: '#e0e0e0',
                              my: 1
                            }}
                          />
                        )}
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        No upcoming events scheduled
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        Check back later for new events
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* FAQ Section - Only show if FAQs exist */}
          {trackFaqs.length > 0 && (
            <Box sx={{ mt: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 6,
                  color: '#1a1a1a',
                  textAlign: 'center',
                  fontSize: { xs: '1.75rem', md: '2.25rem' }
                }}
              >
                Frequently Asked Questions
              </Typography>

              <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                {trackFaqs.map((faq, index) => (
                  <Accordion
                    key={index}
                    sx={{
                      mb: 2,
                      bgcolor: 'white',
                      border: '1px solid #e0e0e0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      borderRadius: '12px !important',
                      '&:before': { display: 'none' }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: '#EE1E50' }} />}
                      sx={{
                        py: 2,
                        px: 3
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '1.1rem' }}>
                        {faq.question || `Question ${index + 1}`}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ bgcolor: '#fafafa', px: 3, py: 3 }}>
                      <Typography sx={{ color: '#555', lineHeight: 1.7, fontSize: '1rem' }}>
                        {faq.answer || 'No answer available.'}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}