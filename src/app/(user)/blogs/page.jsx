'use client';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Grid, Card, CardActionArea, CardMedia, CardContent, Chip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const blogPosts = [
  {
    _id: '1',
    slug: 'track-day-photography-tips',
    title: 'Track Day Photography Tips: Capturing Speed and Motion',
    excerpt:
      'Learn the essential techniques for capturing stunning motorsport photography at track days. From camera settings to positioning, we cover everything you need to know.',
    featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop',
    author: 'James Mitchell',
    category: 'Photography Tips',
    publishedDate: '2025-02-15',
    readTime: '8 min read'
  },
  {
    _id: '2',
    slug: 'best-race-tracks-europe',
    title: 'The 10 Best Race Tracks in Europe for Track Days',
    excerpt:
      "Discover Europe's most iconic racing circuits perfect for track days. From Spa-Francorchamps to the Nürburgring, explore the tracks every enthusiast should experience.",
    featuredImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=500&fit=crop',
    author: 'Sarah Thompson',
    category: 'Track Guides',
    publishedDate: '2025-02-10',
    readTime: '12 min read'
  },
  {
    _id: '3',
    slug: 'motorsport-photography-gear-guide',
    title: 'Essential Gear for Motorsport Photography in 2025',
    excerpt:
      'A comprehensive guide to the cameras, lenses, and accessories you need for professional motorsport photography. Updated for 2025 with the latest equipment recommendations.',
    featuredImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=500&fit=crop',
    author: 'Michael Chen',
    category: 'Gear Reviews',
    publishedDate: '2025-02-05',
    readTime: '10 min read'
  },
  {
    _id: '4',
    slug: 'first-track-day-guide',
    title: "Your First Track Day: A Complete Beginner's Guide",
    excerpt:
      'Everything you need to know before attending your first track day. From preparation and safety to etiquette and what to expect on the day.',
    featuredImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=500&fit=crop',
    author: 'Emma Roberts',
    category: 'Tutorials',
    publishedDate: '2025-01-28',
    readTime: '15 min read'
  },
  {
    _id: '5',
    slug: 'panning-technique-motorsport',
    title: 'Mastering the Panning Technique for Dynamic Racing Photos',
    excerpt:
      'Learn how to create stunning motion blur effects in your motorsport photography. Step-by-step guide to perfecting the panning technique.',
    featuredImage: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800&h=500&fit=crop',
    author: 'David Wilson',
    category: 'Photography Tips',
    publishedDate: '2025-01-20',
    readTime: '7 min read'
  },
  {
    _id: '6',
    slug: 'editing-workflow-motorsport-photos',
    title: 'Professional Editing Workflow for Motorsport Photography',
    excerpt:
      'Discover the post-processing techniques used by professional motorsport photographers. From color correction to sharpening, elevate your images.',
    featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop',
    author: 'James Mitchell',
    category: 'Editing',
    publishedDate: '2025-01-12',
    readTime: '11 min read'
  }
];

export default function BlogsPage() {
  const router = useRouter();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
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

          {/* Blog Posts Grid */}
          <Grid container spacing={4}>
            {blogPosts.map((post) => (
              <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={post._id}>
                {/* H3 for each blog post title */}
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardActionArea onClick={() => router.push(`/blogs/${post.slug}`)} sx={{ height: '100%' }}>
                    {/* Featured Image */}
                    <CardMedia
                      component="img"
                      height="220"
                      image={post.featuredImage}
                      alt={post.title}
                      sx={{ objectFit: 'cover' }}
                    />

                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Category Chip */}
                      <Chip
                        label={post.category}
                        size="small"
                        sx={{
                          bgcolor: '#EE1E50',
                          color: 'white',
                          fontWeight: 600,
                          mb: 2,
                          width: 'fit-content'
                        }}
                      />

                      {/* Post Title - H3 */}
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: { xs: '0.6rem', sm: '1rem', md: '1.4rem' },
                          fontWeight: 700,
                          color: '#1a1a1a',
                          mb: 2,
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {post.title}
                      </Typography>

                      {/* Excerpt */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          mb: 3,
                          lineHeight: 1.6,
                          flexGrow: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {post.excerpt}
                      </Typography>

                      {/* Meta Info */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          pt: 2,
                          borderTop: '1px solid #e0e0e0'
                        }}
                      >
                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                          {post.author}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 14, color: '#666' }} />
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {post.readTime}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Read More Link */}
                      <Typography
                        sx={{
                          color: '#EE1E50',
                          fontWeight: 600,
                          mt: 2,
                          fontSize: '0.95rem'
                        }}
                      >
                        Read More →
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
