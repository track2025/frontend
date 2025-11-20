'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import {
  Box,
  Container,
  Grid,
  Typography,
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
  CardActionArea
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import { getProducts } from 'src/services';
import { getTrackEventsByTrackSlug } from 'src/services/tracks';
import ProductList from '../../_main/products/productList';
import { BlogPagination } from 'src/components/_main/blog/BlogPagination';
import SortBar2 from 'src/components/_main/products/sortbar2';
import { useTheme } from '@mui/material/styles';
import SortBar3 from '../products/sortbar3';

export default function TrackDetailsClient({ track }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState('12');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const params = useParams();
  const searchParams = useSearchParams();
  const { rate } = useSelector(({ settings }) => settings);

  const productsSectionRef = useRef(null);
  const previousFiltersRef = useRef('');

  const slug = params.slug;

  // Get all query parameters
  const pageFromUrl = searchParams.get('page');
  const limitFromUrl = searchParams.get('limit');
  const searchFromUrl = searchParams.get('search');
  const makeFromUrl = searchParams.get('make');
  const modelFromUrl = searchParams.get('model');
  const dateFromUrl = searchParams.get('date_captured');
  const locationFromUrl = searchParams.get('location');
  const topFromUrl = searchParams.get('top');
  const nameFromUrl = searchParams.get('name');
  const dateSortFromUrl = searchParams.get('date');
  const priceFromUrl = searchParams.get('price');
  const DEFAULT_ITEMS_PER_PAGE = itemsPerPage;

  const searchQuery = searchFromUrl || '';

  // Create a string representation of current filters for comparison
  const currentFiltersString = useMemo(() => {
    const filterParams = {
      search: searchFromUrl,
      make: makeFromUrl,
      model: modelFromUrl,
      date: dateFromUrl,
      location: locationFromUrl,
      top: topFromUrl,
      name: nameFromUrl,
      dateSort: dateSortFromUrl,
      price: priceFromUrl
    };
    return JSON.stringify(filterParams);
  }, [
    searchFromUrl,
    makeFromUrl,
    modelFromUrl,
    dateFromUrl,
    locationFromUrl,
    topFromUrl,
    nameFromUrl,
    dateSortFromUrl,
    priceFromUrl
  ]);

  // Check if there are any active filters
  const hasActiveFilters = useMemo(() => {
    const filterParams = [searchFromUrl, makeFromUrl, modelFromUrl, dateFromUrl, locationFromUrl];
    const sortParams = [topFromUrl, nameFromUrl, dateSortFromUrl, priceFromUrl];

    const hasFilterParams = filterParams.some((param) => param && param.trim() !== '');
    const hasSortParams = sortParams.some((param) => {
      if (!param) return false;
      return true;
    });

    return hasFilterParams || hasSortParams;
  }, [
    searchFromUrl,
    makeFromUrl,
    modelFromUrl,
    dateFromUrl,
    locationFromUrl,
    topFromUrl,
    nameFromUrl,
    dateSortFromUrl,
    priceFromUrl
  ]);

  // Update current page and items per page from URL
  useEffect(() => {
    // Sync page from URL
    if (pageFromUrl && !isNaN(pageFromUrl)) {
      const pageNum = parseInt(pageFromUrl, 10);
      if (pageNum > 0 && pageNum !== currentPage) {
        setCurrentPage(pageNum);
      }
    } else if (!pageFromUrl && currentPage !== 1) {
      setCurrentPage(1);
    }

    // Sync limit from URL
    if (limitFromUrl && ITEMS_PER_PAGE_OPTIONS.includes(limitFromUrl)) {
      if (limitFromUrl !== itemsPerPage) {
        setItemsPerPage(limitFromUrl);
      }
    } else if (!limitFromUrl && itemsPerPage !== DEFAULT_ITEMS_PER_PAGE) {
      setItemsPerPage(DEFAULT_ITEMS_PER_PAGE);
    }
  }, [pageFromUrl, limitFromUrl]);

  // Mark initial load as complete after first render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Scroll to products section when filters change
  useEffect(() => {
    if (
      !isInitialLoad &&
      hasActiveFilters &&
      productsSectionRef.current &&
      currentFiltersString !== previousFiltersRef.current
    ) {
      const timer = setTimeout(() => {
        if (productsSectionRef.current) {
          productsSectionRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);

      previousFiltersRef.current = currentFiltersString;
      return () => clearTimeout(timer);
    }
  }, [hasActiveFilters, currentFiltersString, isInitialLoad]);

  // Build query parameters for API call
  const buildQueryParams = () => {
    const queryParams = new URLSearchParams();
    queryParams.append('location', track.name);
    queryParams.append('page', currentPage.toString());
    queryParams.append('limit', itemsPerPage.toString());
    queryParams.append('date', '1');

    if (searchQuery.trim()) {
      queryParams.append('search', searchQuery.trim());
    }

    if (makeFromUrl?.trim()) {
      queryParams.append('make', makeFromUrl.trim());
    }

    if (modelFromUrl?.trim()) {
      queryParams.append('model', modelFromUrl.trim());
    }

    if (dateFromUrl) {
      queryParams.append('date_captured', dateFromUrl);
    }

    if (rate) {
      queryParams.append('rate', rate);
    }

    return queryParams.toString();
  };

  // Create query key
  const queryKey = `track-products-${slug}-${rate}-${currentPage}-${itemsPerPage}-${searchQuery}-${makeFromUrl}-${modelFromUrl}-${dateFromUrl}`;

  // Fetch products
  const { data: productsData, isLoading: productsLoading } = useQuery(
    queryKey,
    () => {
      const queryString = buildQueryParams();
      return getProducts(`?${queryString}`);
    },
    {
      enabled: !!slug && !!track.name,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      keepPreviousData: true
    }
  );

  // Fetch events
  const { data: eventsData, isLoading: eventsLoading } = useQuery(
    `track-events-${slug}`,
    () => getTrackEventsByTrackSlug(slug),
    {
      enabled: !!slug,
      staleTime: 5 * 60 * 1000
    }
  );

  const products = productsData?.data || [];
  const paginationInfo = productsData || {};
  const upcomingEvents = eventsData?.data || [];

  const pagination = {
    currentPage: paginationInfo.currentPage || currentPage,
    totalPages: paginationInfo.count || Math.ceil((paginationInfo.total || 0) / parseInt(itemsPerPage, 10)),
    totalItems: paginationInfo.total || 0,
    itemsPerPage: parseInt(itemsPerPage, 10)
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);

    const params = new URLSearchParams(searchParams.toString());

    // Only add page parameter if it's not page 1
    if (newPage === 1) {
      params.delete('page');
    } else {
      params.set('page', newPage.toString());
    }

    // Only add limit parameter if it's not the default
    if (itemsPerPage === DEFAULT_ITEMS_PER_PAGE) {
      params.delete('limit');
    } else {
      params.set('limit', itemsPerPage.toString());
    }

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

  // Safe data access with fallbacks
  const trackName = track.name || 'Unknown Track';
  const trackCity = track.city || 'Unknown City';
  const trackCountry = track.country || 'Unknown Country';
  const trackDescription = track.fullDescription || track.description || 'No description available.';
  const trackLength = track.length || 'N/A';
  const trackCorners = track.corners || 'N/A';

  // Image URLs with fallbacks
  const defaultBannerUrl =
    'https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,f_jpg,h_465,q_65,w_640/v1/crm/virginia/25RIC2CJ_07968_DC74D7F8-03B1-4525-AEB8CE9364DD4AFA_2f960371-6458-4eac-8ba0591de4c5f106.jpg';
  const bannerImage = track.bannerImage?.url || track.thumbnailImage?.url || defaultBannerUrl;
  const logoImage = track.logo?.url || null;

  // Arrays with fallbacks
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

  const sortData = [
    { title: 'Price low to high', key: 'price', value: 1 },
    { title: 'Price high to low', key: 'price', value: -1 },
    { title: 'Oldest', key: 'date', value: 1 },
    { title: 'Newest', key: 'date', value: -1 }
  ];

  const theme = useTheme();

  return (
    <>
      <Box sx={{ minHeight: '100vh' }}>
        {/* Banner Section */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: 300, sm: 400, md: 500 },
            overflow: 'hidden',
            mt: 0
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: {
                xs: '-10px', // mobile
                sm: 10, // tablet
                md: 10 // desktop
              },
              left: 0,
              zIndex: 100
            }}
          >
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
          </Box>

          {/* Banner Image with Next.js Image component */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          >
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
                console.log('Banner image failed to load, using fallback');
                e.target.src = defaultBannerUrl;
              }}
              onLoad={(e) => {
                console.log('Banner image loaded successfully');
              }}
            />
          </Box>

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
                  width: { xs: 50, sm: 120, md: 140 },
                  height: { xs: 50, sm: 120, md: 140 },
                  margin: '0 auto 20px',
                  bgcolor: 'white',
                  borderRadius: '50%',
                  p: 1,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <Box
                  component="img"
                  src={logoImage}
                  alt={`${trackName} logo`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    console.log('Logo image failed to load, hiding logo');
                    e.target.style.display = 'none';
                    e.target.parentElement.style.display = 'none';
                  }}
                  onLoad={(e) => {
                    console.log('Logo image loaded successfully');
                  }}
                />
              </Box>
            )}

            {/* Rest of the banner content remains the same */}
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                fontWeight: 800,
                fontSize: { xs: '20px', sm: '2.5rem', md: '3rem' },
                textShadow: '0 2px 11px rgba(0,0,0,0.5)',
                mb: 1
              }}
            >
              {trackName}
            </Typography>

            {/* Location and Track Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
                <LocationOnIcon
                  sx={{
                    color: 'white',
                    fontSize: {
                      xs: '13px',
                      sm: '0.95rem',
                      md: '1.1rem'
                    }
                  }}
                />
                <Typography
                  sx={{
                    color: 'white',
                    fontSize: {
                      xs: '13px',
                      sm: '0.95rem',
                      md: '1.1rem'
                    },
                    textAlign: 'center'
                  }}
                >
                  {trackCity}, {trackCountry}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'flex-start', sm: 'center', md: 'center' },
                  gap: 0.5,
                  width: {
                    xs: '80%',
                    sm: '90%',
                    md: '90%'
                  },
                  justifyContent: 'center'
                }}
              >
                <SpeedIcon
                  sx={{
                    color: 'white',
                    fontSize: {
                      xs: '13px',
                      sm: '0.95rem',
                      md: '1.1rem'
                    },
                    marginTop: { xs: '3px', sm: '0', md: '0' }
                  }}
                />
                <Typography
                  sx={{
                    color: 'white',
                    fontSize: {
                      xs: '13px',
                      sm: '0.95rem',
                      md: '1.1rem'
                    },
                    textAlign: 'center'
                  }}
                >
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
              variant="h3"
              sx={{
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 700,
                mb: 2
              }}
            >
              About {trackName}
            </Typography>
            <Typography
              sx={{
                fontSize: '16px',
                lineHeight: 1.7,
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
                {/* Search Section */}
                <Box sx={{ mb: 4, py: 2 }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      mb: 2
                    }}
                  >
                    Professional motorsport photography from {trackName}
                  </Typography>
                  <SortBar3
                    sortData={sortData}
                    productData={products}
                    showLocationSearch={false}
                    showApplyButton={true}
                    defaultItemsPerPage={itemsPerPage}
                  />
                </Box>

                {/* Products Grid */}
                {productsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress sx={{ color: '#EE1E50' }} />
                  </Box>
                ) : products.length > 0 ? (
                  <Box style={{ marginTop: -20 }}>
                    {/* Product List */}
                    <ProductList data={{ data: products }} isLoading={false} isMobile={false} />

                    {/* Pagination */}
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

          {/* FAQ Section */}
          {trackFaqs.length > 0 && (
            <Box sx={{ mt: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 6,
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
                      <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        {faq.question || `Question ${index + 1}`}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 3, py: 3 }}>
                      <Typography sx={{ lineHeight: 1.7, fontSize: '1rem' }}>
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
