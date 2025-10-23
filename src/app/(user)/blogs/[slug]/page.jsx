'use client';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Chip,
  Divider,
  Button,
  IconButton,
  Avatar
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShareIcon from '@mui/icons-material/Share';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const blogPostsMap = {
  'track-day-photography-tips': {
    slug: 'track-day-photography-tips',
    title: 'Track Day Photography Tips: Capturing Speed and Motion',
    metaTitle: 'Track Day Photography Tips: Capturing Speed and Motion | LapSnaps Blog',
    metaDescription:
      'Learn essential techniques for capturing stunning motorsport photography at track days. Camera settings, positioning, and pro tips from experienced photographers.',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop',
    author: 'James Mitchell',
    authorAvatar: 'https://i.pravatar.cc/150?img=12',
    category: 'Photography Tips',
    publishedDate: '2025-02-15',
    readTime: '8 min read',
    content: `
      <h2>Camera Settings for Track Day Photography</h2>
      <p>Getting the right camera settings is crucial for capturing sharp, dynamic images at track days. Here are the essential settings you need to master:</p>
      
      <h3>Shutter Speed</h3>
      <p>For frozen action shots, use a shutter speed of at least 1/1000s or faster. For panning shots with motion blur, try 1/125s to 1/250s depending on the speed of the vehicles.</p>
      
      <h3>Aperture</h3>
      <p>Use f/2.8 to f/5.6 for individual cars to create a shallow depth of field. For group shots or wider scenes, use f/8 to f/11 to keep more of the scene in focus.</p>
      
      <h3>ISO</h3>
      <p>Keep ISO as low as possible (100-400) in good lighting conditions. In overcast conditions or late afternoon, you may need to increase to 800-1600.</p>
      
      <h2>Positioning and Composition</h2>
      <p>Where you position yourself at the track makes a huge difference to your photos. Look for corners where cars are turning, braking zones, or elevation changes that add drama to your shots.</p>
      
      <h3>Lens Choices</h3>
      <p>A 70-200mm f/2.8 lens is the workhorse for motorsport photography. For wider environmental shots, a 24-70mm is perfect. If you want to capture distant action, consider a 100-400mm or 150-600mm telephoto.</p>
      
      <h2>Panning Technique</h2>
      <p>Panning is essential for creating dynamic motion blur effects. Follow the car smoothly with your camera, keeping it in the same position in your frame. Press the shutter while continuing the pan, and follow through after the shot.</p>
      
      <h2>Post-Processing Tips</h2>
      <p>In post-processing, focus on enhancing colors, increasing contrast, and sharpening details. Be careful not to over-process – motorsport photography should look natural and dynamic.</p>
    `
  },
  'best-race-tracks-europe': {
    slug: 'best-race-tracks-europe',
    title: 'The 10 Best Race Tracks in Europe for Track Days',
    metaTitle: 'The 10 Best Race Tracks in Europe for Track Days | LapSnaps Blog',
    metaDescription:
      "Discover Europe's most iconic racing circuits perfect for track days. From Spa-Francorchamps to the Nürburgring, explore the tracks every enthusiast should experience.",
    heroImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&h=600&fit=crop',
    author: 'Sarah Thompson',
    authorAvatar: 'https://i.pravatar.cc/150?img=5',
    category: 'Track Guides',
    publishedDate: '2025-02-10',
    readTime: '12 min read',
    content: `
      <h2>1. Circuit de Spa-Francorchamps, Belgium</h2>
      <p>Often considered the greatest racing circuit in the world, Spa-Francorchamps offers 7km of challenging corners, elevation changes, and high-speed sections. The legendary Eau Rouge-Raidillon complex is a must-experience for any driving enthusiast.</p>
      
      <h2>2. Nürburgring Nordschleife, Germany</h2>
      <p>The "Green Hell" needs no introduction. With over 150 corners across 20.8km, the Nordschleife is the ultimate test of driver skill and car performance. It's a bucket-list track for every motorsport enthusiast.</p>
      
      <h2>3. Silverstone Circuit, United Kingdom</h2>
      <p>Home of the British Grand Prix, Silverstone features fast, flowing corners that reward commitment and precision. The circuit offers various configurations suitable for different skill levels.</p>
      
      <h2>4. Monza, Italy</h2>
      <p>The Temple of Speed offers incredible high-speed sections and historic atmosphere. Driving at Monza is like stepping back in time to motorsport's golden era.</p>
      
      <h2>5. Circuit de Barcelona-Catalunya, Spain</h2>
      <p>A modern facility with excellent run-off areas and a variety of corner types. It's a great track for developing your skills in a safe environment.</p>
      
      <h2>Conclusion</h2>
      <p>Each of these circuits offers a unique experience and challenges. Whether you're a beginner or experienced track day enthusiast, Europe's racing circuits provide unforgettable driving experiences.</p>
    `
  }
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug || 'track-day-photography-tips';

  const post = blogPostsMap[slug] || blogPostsMap['track-day-photography-tips'];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleShare = (platform) => {
    const url = `https://lapsnaps.com/blogs/${post.slug}`;
    const text = post.title;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
    }
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <title>{post.metaTitle}</title>
      <meta name="description" content={post.metaDescription} />
      <meta name="keywords" content={`${post.category}, motorsport blog, ${post.title}, track day tips`} />
      <link rel="canonical" href={`https://lapsnaps.com/blogs/${post.slug}`} />

      <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Hero Image */}
        <Box
          sx={{
            width: '100%',
            height: { xs: 300, sm: 400, md: 500 },
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            component="img"
            src={post.heroImage}
            alt={post.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
            }}
          />
        </Box>

        <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
          {/* Breadcrumbs */}
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }} aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              href="/blogs"
              sx={{ cursor: 'pointer', '&:hover': { color: '#EE1E50' } }}
            >
              Blog
            </Link>
            <Typography color="text.primary">{post.title}</Typography>
          </Breadcrumbs>

          {/* Back Button */}
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/blogs')} sx={{ mb: 3, color: '#666' }}>
            Back to Blog
          </Button>

          {/* Article Header */}
          <Box sx={{ bgcolor: 'white', p: { xs: 3, md: 5 }, borderRadius: 2, boxShadow: 2, mb: 4 }}>
            {/* Category */}
            <Chip
              label={post.category}
              sx={{
                bgcolor: '#EE1E50',
                color: 'white',
                fontWeight: 600,
                mb: 2
              }}
            />

            {/* H1 Title */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
                fontWeight: 800,
                color: '#1a1a1a',
                mb: 3,
                lineHeight: 1.2
              }}
            >
              {post.title}
            </Typography>

            {/* Meta Info */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                mb: 3,
                flexWrap: 'wrap'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar src={post.authorAvatar} alt={post.author} sx={{ width: 40, height: 40 }} />
                {/* H3 Author name */}
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.7rem', sm: '0.7rem', md: '1rem' },
                    color: '#1a1a1a'
                  }}
                >
                  {post.author}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: '#666' }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {formatDate(post.publishedDate)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 16, color: '#666' }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {post.readTime}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Share Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShareIcon sx={{ color: '#666', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#666', mr: 1 }}>
                Share:
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleShare('facebook')}
                sx={{ color: '#1877F2', '&:hover': { bgcolor: 'rgba(24, 119, 242, 0.1)' } }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleShare('twitter')}
                sx={{ color: '#1DA1F2', '&:hover': { bgcolor: 'rgba(29, 161, 242, 0.1)' } }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleShare('linkedin')}
                sx={{ color: '#0A66C2', '&:hover': { bgcolor: 'rgba(10, 102, 194, 0.1)' } }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Article Content */}
          <Box sx={{ bgcolor: 'white', p: { xs: 3, md: 5 }, borderRadius: 2, boxShadow: 2 }}>
            <Box
              dangerouslySetInnerHTML={{ __html: post.content }}
              sx={{
                '& h2': {
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  fontWeight: 700,
                  color: '#1a1a1a',
                  mt: 4,
                  mb: 2,
                  lineHeight: 1.3
                },
                '& h3': {
                  fontSize: { xs: '1.25rem', md: '1.4rem' },
                  fontWeight: 600,
                  color: '#1a1a1a',
                  mt: 3,
                  mb: 1.5,
                  lineHeight: 1.3
                },
                '& p': {
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  color: '#333',
                  mb: 2.5
                },
                '& ul, & ol': {
                  pl: 3,
                  mb: 2.5
                },
                '& li': {
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  color: '#333',
                  mb: 1
                }
              }}
            />
          </Box>

          {/* Share Again at Bottom */}
          <Box
            sx={{
              bgcolor: 'white',
              p: 3,
              borderRadius: 2,
              boxShadow: 2,
              mt: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Share this article:
            </Typography>
            <IconButton
              onClick={() => handleShare('facebook')}
              sx={{ color: '#1877F2', '&:hover': { bgcolor: 'rgba(24, 119, 242, 0.1)' } }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              onClick={() => handleShare('twitter')}
              sx={{ color: '#1DA1F2', '&:hover': { bgcolor: 'rgba(29, 161, 242, 0.1)' } }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              onClick={() => handleShare('linkedin')}
              sx={{ color: '#0A66C2', '&:hover': { bgcolor: 'rgba(10, 102, 194, 0.1)' } }}
            >
              <LinkedInIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>
    </>
  );
}
