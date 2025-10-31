// 'use client';
// import { useRouter } from 'next/navigation';
// import {
//   Typography,
//   Box,
//   Container,
//   Grid,
//   Card,
//   CardActionArea,
//   CardMedia,
//   CardContent,
//   Skeleton
// } from '@mui/material';
// import tracksData from '../../../data/tracks.json';

// export default function TracksPage() {
//   const router = useRouter();
//   const isLoading = false;

//   const structuredData = {
//     '@context': 'https://schema.org',
//     '@type': 'CollectionPage',
//     name: 'Car, Bike & Kart Race Tracks Worldwide',
//     description:
//       'Explore car, bike & kart circuits from around the world. Browse iconic race tracks including Silverstone, Spa-Francorchamps, Nürburgring and more.',
//     url: 'https://lapsnaps.com/tracks',
//     mainEntity: {
//       '@type': 'ItemList',
//       itemListElement: tracksData.map((track, index) => ({
//         '@type': 'ListItem',
//         position: index + 1,
//         item: {
//           '@type': 'Place',
//           '@id': `https://lapsnaps.com/tracks/${track.slug}`,
//           name: track.name,
//           description: track.description,
//           address: {
//             '@type': 'PostalAddress',
//             addressLocality: track.city,
//             addressRegion: track.region,
//             addressCountry: track.country
//           },
//           geo: {
//             '@type': 'GeoCoordinates',
//             latitude: track.latitude,
//             longitude: track.longitude
//           },
//           aggregateRating: {
//             '@type': 'AggregateRating',
//             ratingValue: track.rating,
//             reviewCount: track.reviewCount
//           }
//         }
//       }))
//     }
//   };

//   return (
//     <>
//       <title>Car, Bike & Kart Race Tracks Worldwide | LapSnaps</title>
//       <meta
//         name="description"
//         content="Explore car, bike & kart circuits from around the world. Browse iconic race tracks including Silverstone, Spa-Francorchamps, Nürburgring, Bedford Autodrome, Yas Marina, and more. Find track days and motorsport events."
//       />
//       <meta
//         name="keywords"
//         content="race tracks, motorsport circuits, car racing, bike racing, kart racing, track days, silverstone, spa francorchamps, nurburgring, yas marina, dubai autodrome, bedford autodrome, brands hatch, racing circuits worldwide"
//       />
//       <link rel="canonical" href="https://lapsnaps.com/tracks" />

//       <meta property="og:title" content="Car, Bike & Kart Race Tracks Worldwide | LapSnaps" />
//       <meta
//         property="og:description"
//         content="Explore car, bike & kart circuits from around the world. Browse iconic race tracks and find track days."
//       />
//       <meta property="og:url" content="https://lapsnaps.com/tracks" />
//       <meta property="og:type" content="website" />

//       <meta name="twitter:card" content="summary_large_image" />
//       <meta name="twitter:title" content="Car, Bike & Kart Race Tracks Worldwide | LapSnaps" />
//       <meta name="twitter:description" content="Explore car, bike & kart circuits from around the world." />

//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

//       <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: { xs: 4, md: 6 } }}>
//         <Container maxWidth="xl">
//           {/* H1 Heading */}
//           <Typography
//             variant="h1"
//             sx={{
//               fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
//               fontWeight: 800,
//               color: '#1a1a1a',
//               textAlign: 'center',
//               mb: 2
//             }}
//           >
//             All Race Tracks on LapSnaps
//           </Typography>

//           {/* H2 Subheading */}
//           <Typography
//             variant="h2"
//             sx={{
//               fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
//               fontWeight: 400,
//               color: '#666',
//               textAlign: 'center',
//               mb: 6,
//               maxWidth: '800px',
//               mx: 'auto'
//             }}
//           >
//             Explore Car, Bike & Kart Circuits from Around the World
//           </Typography>

//           {/* Tracks Grid - Responsive 2-5 columns */}
//           {isLoading ? (
//             <Grid container spacing={3}>
//               {Array.from(new Array(6)).map((_, index) => (
//                 <Grid item xs={6} sm={4} md={3} lg={2.4} key={index}>
//                   <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />
//                 </Grid>
//               ))}
//             </Grid>
//           ) : tracksData.length > 0 ? (
//             <Grid container spacing={3}>
//               {tracksData.map((track) => (
//                 <Grid item size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} key={track.id}>
//                   <Card
//                     sx={{
//                       height: '100%',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       borderRadius: 2,
//                       boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//                       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                       overflow: 'visible',
//                       '&:hover': {
//                         transform: 'translateY(-8px)',
//                         boxShadow: '0 12px 32px rgba(238, 30, 80, 0.2)'
//                       }
//                     }}
//                   >
//                     <CardActionArea
//                       onClick={() => router.push(`/tracks/${track.slug}`)}
//                       sx={{
//                         height: '100%',
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'stretch',
//                         p: 0
//                       }}
//                     >
//                       {/* Image Container with Logo Overlay */}
//                       <Box
//                         sx={{
//                           position: 'relative',
//                           width: '100%',
//                           height: 200, // Fixed height for larger images
//                           overflow: 'hidden'
//                         }}
//                       >
//                         {/* Main Track Image */}
//                         <Box
//                           component="img"
//                           src={track.thumbnailImage}
//                           alt={`${track.name} - ${track.city}, ${track.country}`}
//                           sx={{
//                             width: '100%',
//                             height: '100%',
//                             objectFit: 'cover',
//                             transition: 'transform 0.3s ease',
//                             '&:hover': {
//                               transform: 'scale(1.05)'
//                             }
//                           }}
//                         />

//                         {/* Logo Overlay */}
//                         <Box
//                           sx={{
//                             position: 'absolute',
//                             top: 12,
//                             left: 12,
//                             width: 50,
//                             height: 50,
//                             bgcolor: 'white',
//                             borderRadius: '50%',
//                             p: 0.5,
//                             boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             border: '2px solid #fff'
//                           }}
//                         >
//                           <Box
//                             component="img"
//                             src={track.logo}
//                             alt={`${track.name} logo`}
//                             sx={{
//                               width: '100%',
//                               height: '100%',
//                               objectFit: 'contain',
//                               borderRadius: '50%'
//                             }}
//                           />
//                         </Box>

//                         {/* Country Flag/Info Overlay */}
//                         <Box
//                           sx={{
//                             position: 'absolute',
//                             bottom: 12,
//                             right: 12,
//                             bgcolor: 'rgba(0,0,0,0.8)',
//                             color: 'white',
//                             px: 1.5,
//                             py: 0.5,
//                             borderRadius: 1,
//                             fontSize: '0.75rem',
//                             fontWeight: 600,
//                             backdropFilter: 'blur(4px)'
//                           }}
//                         >
//                           {track.countryCode}
//                         </Box>
//                       </Box>

//                       {/* Card Content - Compact */}
//                       <CardContent
//                         sx={{
//                           p: 2,
//                           flexGrow: 1,
//                           display: 'flex',
//                           flexDirection: 'column',
//                           justifyContent: 'center'
//                         }}
//                       >
//                         <Typography
//                           variant="h3"
//                           sx={{
//                             fontSize: '1rem',
//                             fontWeight: 700,
//                             color: '#1a1a1a',
//                             textAlign: 'center',
//                             mb: 0.5,
//                             lineHeight: 1.3,
//                             minHeight: '2.6rem',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                           }}
//                         >
//                           {track.name}
//                         </Typography>

//                         <Typography
//                           variant="body2"
//                           sx={{
//                             color: '#666',
//                             textAlign: 'center',
//                             fontSize: '0.85rem',
//                             mb: 1
//                           }}
//                         >
//                           {track.city}, {track.country}
//                         </Typography>

//                         <Box sx={{ textAlign: 'center' }}>
//                           <Typography
//                             variant="body2"
//                             sx={{
//                               color: '#EE1E50',
//                               fontWeight: 600,
//                               fontSize: '0.8rem',
//                               mb: 0.5
//                             }}
//                           >
//                             {track.length}
//                           </Typography>
//                           <Typography
//                             variant="caption"
//                             sx={{
//                               color: '#666',
//                               fontSize: '0.75rem'
//                             }}
//                           >
//                             {track.corners} Corners
//                           </Typography>
//                         </Box>

//                         {/* Rating */}
//                         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
//                           <Box
//                             sx={{
//                               display: 'flex',
//                               alignItems: 'center',
//                               gap: 0.5
//                             }}
//                           >
//                             <Box
//                               sx={{
//                                 color: '#FFD700',
//                                 fontSize: '0.9rem'
//                               }}
//                             >
//                               ★
//                             </Box>
//                             <Typography
//                               variant="caption"
//                               sx={{
//                                 color: '#666',
//                                 fontWeight: 600,
//                                 fontSize: '0.75rem'
//                               }}
//                             >
//                               {track.rating}
//                             </Typography>
//                             <Typography
//                               variant="caption"
//                               sx={{
//                                 color: '#999',
//                                 fontSize: '0.7rem'
//                               }}
//                             >
//                               ({track.reviewCount})
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </CardContent>
//                     </CardActionArea>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           ) : (
//             <Typography variant="h3" color="error.main" textAlign="center" sx={{ py: 8 }}>
//               No tracks found
//             </Typography>
//           )}
//         </Container>
//       </Box>
//     </>
//   );
// }

'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Typography, Box, Container, Grid, Alert } from '@mui/material';
import { getTracks } from 'src/services/tracks';
import { TrackCardCompact, TrackCardCompactSkeleton } from 'src/components/_main/track/TrackCardCompact';
import { BlogPagination } from 'src/components/_main/blog/BlogPagination';

export default function TracksPage() {
  const router = useRouter();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 16
  });

  const fetchTracks = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTracks({
        limit: pagination.itemsPerPage,
        page: page
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

  useEffect(() => {
    fetchTracks(1);
  }, []);

  const handlePageChange = (newPage) => {
    fetchTracks(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardClick = (slug) => {
    if (slug) {
      router.push(`/tracks/${slug}`);
    }
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

      <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="xl">
          {/* H1 Heading */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.3rem' },
              fontWeight: 800,
              color: '#1a1a1a',
              textAlign: 'center',
              mb: 2
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
              mb: 6,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Explore Car, Bike & Kart Circuits from Around the World
          </Typography>

          {/* Error state */}
          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {/* Tracks Grid - Using compact layout similar to Brands component */}
          <Grid container spacing={2} justifyContent="center">
            {loading ? (
              // Skeleton loading state
              Array.from(new Array(pagination.itemsPerPage)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
                  <TrackCardCompactSkeleton />
                </Grid>
              ))
            ) : tracks.length > 0 ? (
              // Actual tracks with compact layout
              tracks.map((track) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={track._id}>
                  <TrackCardCompact track={track} onClick={handleCardClick} />
                </Grid>
              ))
            ) : (
              // Empty state
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h5" sx={{ color: '#666', mb: 2 }}>
                    No tracks found
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#999' }}>
                    Check back later for new tracks!
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
