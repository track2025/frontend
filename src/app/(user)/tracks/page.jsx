// 'use client';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import { Typography, Box, Container, Grid, Alert } from '@mui/material';
// import { getTracks } from 'src/services/tracks';
// import { TrackCard } from 'src/components/_main/track/TrackCard';
// import { TrackCardSkeleton } from 'src/components/_main/track/TrackCardSkeleton';
// import { BlogPagination } from 'src/components/_main/blog/BlogPagination';

// export default function TracksPage() {
//   const router = useRouter();
//   const [tracks, setTracks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//     itemsPerPage: 16
//   });

//   const fetchTracks = async (page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await getTracks({
//         limit: pagination.itemsPerPage,
//         page: page
//       });

//       // console.log('Tracks API Response:', response);

//       if (response.success) {
//         setTracks(response.data || []);
//         setPagination((prev) => ({
//           ...prev,
//           currentPage: response.currentPage || page,
//           totalPages: response.count || 1,
//           totalItems: response.total || 0
//         }));
//       } else {
//         setError('Failed to load tracks');
//         setTracks([]);
//       }
//     } catch (err) {
//       console.error('Error fetching tracks:', err);
//       setError('Unable to load tracks. Please try again later.');
//       setTracks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTracks(1);
//   }, []);

//   const handlePageChange = (newPage) => {
//     fetchTracks(newPage);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleCardClick = (slug) => {
//     if (slug) {
//       router.push(`/tracks/${slug}`);
//     }
//   };

//   // Safe structured data generation
//   const structuredData = {
//     '@context': 'https://schema.org',
//     '@type': 'CollectionPage',
//     name: 'Car, Bike & Kart Race Tracks Worldwide',
//     description:
//       'Explore car, bike & kart circuits from around the world. Browse iconic race tracks including Silverstone, Spa-Francorchamps, Nürburgring and more.',
//     url: 'https://lapsnaps.com/tracks',
//     mainEntity: {
//       '@type': 'ItemList',
//       itemListElement: tracks.map((track, index) => ({
//         '@type': 'ListItem',
//         position: index + 1,
//         item: {
//           '@type': 'Place',
//           '@id': `https://lapsnaps.com/tracks/${track.slug || track._id}`,
//           name: track.name || 'Unknown Track',
//           description: track.description || '',
//           ...(track.city &&
//             track.country && {
//               address: {
//                 '@type': 'PostalAddress',
//                 addressLocality: track.city,
//                 addressCountry: track.country
//               }
//             })
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
//               fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.3rem' },
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

//           {/* Error state */}
//           {error && (
//             <Alert severity="error" sx={{ mb: 4 }}>
//               {error}
//             </Alert>
//           )}

//           {/* Tracks Grid */}
//           <Grid container spacing={3}>
//             {loading ? (
//               // Skeleton loading state
//               Array.from(new Array(pagination.itemsPerPage)).map((_, index) => (
//                 <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }} key={`skeleton-${index}`}>
//                   <TrackCardSkeleton />
//                 </Grid>
//               ))
//             ) : tracks.length > 0 ? (
//               // Actual tracks
//               tracks.map((track) => (
//                 <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }} key={track._id}>
//                   <TrackCard track={track} onClick={() => handleCardClick(track.slug)} />
//                 </Grid>
//               ))
//             ) : (
//               // Empty state
//               <Grid item size={12}>
//                 <Box sx={{ textAlign: 'center', py: 8 }}>
//                   <Typography variant="h5" sx={{ color: '#666', mb: 2 }}>
//                     No tracks found
//                   </Typography>
//                   <Typography variant="body1" sx={{ color: '#999' }}>
//                     Check back later for new tracks!
//                   </Typography>
//                 </Box>
//               </Grid>
//             )}
//           </Grid>

//           {/* Pagination - Only show if we have multiple pages and not loading */}
//           {!loading && pagination.totalPages > 1 && (
//             <BlogPagination
//               currentPage={pagination.currentPage}
//               totalPages={pagination.totalPages}
//               totalItems={pagination.totalItems}
//               itemsPerPage={pagination.itemsPerPage}
//               onPageChange={handlePageChange}
//             />
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
