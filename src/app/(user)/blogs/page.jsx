// 'use client';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import { Box, Container, Typography, Grid, Alert } from '@mui/material';
// import { getBlogs } from 'src/services/blogs';
// import { BlogCard } from 'src/components/_main/blog/BlogCard';
// import { BlogCardSkeleton } from 'src/components/_main/blog/BlogCardSkeleton';
// import { BlogPagination } from 'src/components/_main/blog/BlogPagination';

// export default function BlogsPage() {
//   const router = useRouter();
//   const [blogPosts, setBlogPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//     itemsPerPage: 8
//   });

//   const fetchBlogs = async (page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await getBlogs({
//         limit: pagination.itemsPerPage,
//         page: page
//       });

//       console.log('API Response:', response); // Debug log

//       if (response.success) {
//         setBlogPosts(response.data || []);

//         setPagination((prev) => ({
//           ...prev,
//           currentPage: response.currentPage || page,
//           totalPages: response.count || 1, // 'count' is total pages from API
//           totalItems: response.total || 0 // 'total' is total items from API
//         }));

//         console.log('Pagination state:', {
//           // Debug log
//           currentPage: response.currentPage || page,
//           totalPages: response.count,
//           totalItems: response.total,
//           itemsPerPage: pagination.itemsPerPage
//         });
//       } else {
//         setError('Failed to load blog posts');
//         setBlogPosts([]);
//       }
//     } catch (err) {
//       console.error('Error fetching blogs:', err);
//       setError('Unable to load blog posts. Please try again later.');
//       setBlogPosts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBlogs(1);
//   }, []);

//   const handlePageChange = (newPage) => {
//     fetchBlogs(newPage);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleCardClick = (slug) => {
//     router.push(`/blogs/${slug}`);
//   };

//   console.log('Render - Pagination:', pagination); // Debug log

//   return (
//     <>
//       {/* SEO Meta Tags */}
//       <title>Motorsport Photography Tips, Track-Day News & Tutorials | LapSnaps</title>
//       <meta
//         name="description"
//         content="Explore the LapSnaps blog for motorsport photography tips, track day guides, gear reviews, and tutorials. Learn from professional photographers and enthusiasts."
//       />
//       <meta
//         name="keywords"
//         content="motorsport photography, track day tips, racing photography, camera settings, photography tutorials, motorsport blog"
//       />
//       <link rel="canonical" href="https://lapsnaps.com/blogs" />

//       <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: { xs: 4, md: 6 } }}>
//         <Container maxWidth="xl">
//           {/* H1 Heading */}
//           <Typography
//             variant="h1"
//             sx={{
//               fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.8rem' },
//               fontWeight: 800,
//               color: '#1a1a1a',
//               textAlign: 'center',
//               mb: 2
//             }}
//           >
//             LapSnaps Blog – Motorsport Photography & Track-Day Insights
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
//             Expert tips, tutorials, and insights for motorsport photographers and track day enthusiasts
//           </Typography>

//           {/* Error state */}
//           {error && (
//             <Alert severity="error" sx={{ mb: 4 }}>
//               {error}
//             </Alert>
//           )}

//           {/* Blog Posts Grid */}
//           <Grid container spacing={4}>
//             {loading ? (
//               Array.from(new Array(pagination.itemsPerPage)).map((_, index) => (
//                 <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={`skeleton-${index}`}>
//                   <BlogCardSkeleton />
//                 </Grid>
//               ))
//             ) : blogPosts.length > 0 ? (
//               blogPosts.map((post) => (
//                 <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={post._id}>
//                   <BlogCard post={post} onClick={() => handleCardClick(post.slug)} />
//                 </Grid>
//               ))
//             ) : (
//               <Grid item size={12}>
//                 <Box sx={{ textAlign: 'center', py: 8 }}>
//                   <Typography variant="h5" sx={{ color: '#666', mb: 2 }}>
//                     No blog posts found
//                   </Typography>
//                   <Typography variant="body1" sx={{ color: '#999' }}>
//                     Check back later for new content!
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
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Alert } from '@mui/material';
import { getBlogs } from 'src/services/blogs';
import { BlogCard } from 'src/components/_main/blog/BlogCard';
import { BlogCardSkeleton } from 'src/components/_main/blog/BlogCardSkeleton';
import { BlogPagination } from 'src/components/_main/blog/BlogPagination';

export default function BlogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 8
  });

  // Get page from URL on component mount and when URL changes
  useEffect(() => {
    const pageFromUrl = searchParams.get('page');
    if (pageFromUrl && !isNaN(pageFromUrl)) {
      const pageNum = parseInt(pageFromUrl, 10);
      if (pageNum > 0 && pageNum !== pagination.currentPage) {
        fetchBlogs(pageNum);
      }
    } else {
      // If no page parameter in URL, set it to page 1 and update URL
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState(null, '', newUrl);
      fetchBlogs(1);
    }
  }, [searchParams]);

  const fetchBlogs = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBlogs({
        limit: pagination.itemsPerPage,
        page: page
      });

      console.log('API Response:', response); // Debug log

      if (response.success) {
        setBlogPosts(response.data || []);

        setPagination((prev) => ({
          ...prev,
          currentPage: response.currentPage || page,
          totalPages: response.count || 1, // 'count' is total pages from API
          totalItems: response.total || 0 // 'total' is total items from API
        }));

        console.log('Pagination state:', {
          // Debug log
          currentPage: response.currentPage || page,
          totalPages: response.count,
          totalItems: response.total,
          itemsPerPage: pagination.itemsPerPage
        });
      } else {
        setError('Failed to load blog posts');
        setBlogPosts([]);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Unable to load blog posts. Please try again later.');
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    // Update URL with the new page parameter
    const params = new URLSearchParams(searchParams.toString());

    // Always set the page parameter, even for page 1
    params.set('page', newPage.toString());

    // Construct the new URL with all existing query parameters
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;

    // Use replaceState to update URL without refreshing the page
    window.history.replaceState(null, '', newUrl);

    // Fetch blogs for the new page
    fetchBlogs(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardClick = (slug) => {
    router.push(`/blogs/${slug}`);
  };

  console.log('Render - Pagination:', pagination); // Debug log

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

      <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="xl">
          {/* H1 Heading */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.8rem' },
              fontWeight: 800,
              color: '#1a1a1a',
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
              color: '#666',
              textAlign: 'center',
              mb: 6,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Expert tips, tutorials, and insights for motorsport photographers and track day enthusiasts
          </Typography>

          {/* Error state */}
          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
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
                  <BlogCard post={post} onClick={() => handleCardClick(post.slug)} />
                </Grid>
              ))
            ) : (
              <Grid item size={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h5" sx={{ color: '#666', mb: 2 }}>
                    No blog posts found
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#999' }}>
                    Check back later for new content!
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
