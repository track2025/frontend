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
import { getBlogPostBySlug } from '../../../../data/blogPosts';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const post = getBlogPostBySlug(slug);

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
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
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
                    fontSize: '1rem',
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
