'use client';
import { useRouter } from 'next/navigation';
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
import { calculateReadingTime } from 'src/utils/readingTime';

export default function BlogPostClient({ post }) {
  const router = useRouter();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleShare = (platform) => {
    const url = typeof window !== 'undefined' ? window.location.href : `https://lapsnaps.com/blogs/${post.slug}`;
    const text = post.title;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
          '_blank'
        );
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
    }
  };

  // const calculateReadTime = calculateReadingTime;
  const { readTime } = calculateReadingTime(post.content);

  return (
    <Box sx={{ minHeight: '100vh' }}>
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
          src={post.heroImage?.url || post.featuredImage?.url || '/images/blog-hero-placeholder.jpg'}
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

        {/* Article Header */}
        <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, boxShadow: 2, mb: 4 }}>
          {/* Category */}
          {post.category && (
            <Chip
              label={post.category}
              sx={{
                bgcolor: '#EE1E50',
                color: 'white',
                fontWeight: 600,
                mb: 2
              }}
            />
          )}

          {/* H1 Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
              fontWeight: 800,
              // color: '#1a1a1a',
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
              <Avatar src={post.authorAvatar?.url} alt={post.author} sx={{ width: 40, height: 40 }} />
              {/* H3 Author name */}
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem'
                  // color: '#1a1a1a'
                }}
              >
                {post.author}
              </Typography>
            </Box>

            {post.publishedDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{}}>
                  {formatDate(post.publishedDate)}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{}}>
                {readTime?.display}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Share Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShareIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2" sx={{ mr: 1 }}>
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
        <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, boxShadow: 2 }}>
          <Box
            dangerouslySetInnerHTML={{ __html: post.content }}
            sx={{
              // Reset and base styles
              '& *': {
                maxWidth: '100%'
              },

              // Headings
              '& h1': {
                fontSize: { xs: '1.8rem', md: '2.2rem' },
                fontWeight: 800,
                // color: '#1a1a1a',
                mt: 4,
                mb: 3,
                lineHeight: 1.2
              },
              '& h2': {
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 700,
                // color: '#1a1a1a',
                mt: 4,
                mb: 2,
                lineHeight: 1.3
              },
              '& h3': {
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 600,
                // color: '#1a1a1a',
                mt: 3,
                mb: 1.5,
                lineHeight: 1.3
              },
              '& h4': {
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontWeight: 600,
                // color: '#1a1a1a',
                mt: 3,
                mb: 1,
                lineHeight: 1.4
              },

              // Paragraphs and text
              '& p': {
                fontSize: '1.05rem',
                lineHeight: 1.8,
                // color: '#333',
                mb: 2.5
              },

              // Lists
              '& ul, & ol': {
                pl: 3,
                mb: 2.5
              },
              '& li': {
                fontSize: '1.05rem',
                lineHeight: 1.8,
                // color: '#333',
                mb: 1
              },

              // Links
              '& a': {
                // color: '#EE1E50',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline'
                }
              },

              // Images
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 1,
                my: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              },

              // Blockquotes
              '& blockquote': {
                borderLeft: '4px solid #EE1E50',
                pl: 3,
                ml: 0,
                py: 1,
                my: 3,
                bgcolor: '#f8f9fa',
                fontStyle: 'italic',
                '& p': {
                  mb: 0
                  // color: '#666'
                }
              },

              // Code blocks
              '& pre': {
                bgcolor: '#1a1a1a',
                // color: 'white',
                p: 3,
                borderRadius: 1,
                overflow: 'auto',
                my: 3,
                fontSize: '0.9rem'
              },
              '& code': {
                bgcolor: '#f5f5f5',
                // color: '#EE1E50',
                px: 1,
                borderRadius: 1,
                fontSize: '0.9rem',
                fontWeight: 600
              },
              '& pre code': {
                bgcolor: 'transparent',
                // color: 'inherit',
                px: 0
              },

              // Tables
              '& table': {
                width: '100%',
                borderCollapse: 'collapse',
                my: 3
              },
              '& th, & td': {
                border: '1px solid #e0e0e0',
                padding: 2,
                textAlign: 'left'
              },
              '& th': {
                bgcolor: '#f8f9fa',
                fontWeight: 600
              },

              // Horizontal rule
              '& hr': {
                border: 'none',
                borderTop: '2px solid #e0e0e0',
                my: 4
              },

              // Strong and emphasis
              '& strong, & b': {
                fontWeight: 700
                // color: '#1a1a1a'
              },
              '& em, & i': {
                fontStyle: 'italic'
              }
            }}
          />
        </Box>

        {/* Share Again at Bottom */}
        <Box
          sx={{
            // bgcolor: 'white',
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
  );
}
