import { Box, Container, Typography, Breadcrumbs, Link as MuiLink, Chip, Divider, Avatar } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { calculateReadingTime } from 'src/utils/readingTime';

// Helper function to process HTML links for security and new tab opening
const processHtmlLinks = (html) => {
  if (!html) return html;

  return (
    html
      // Handle domain-only URLs without protocol (lapsnaps.com/path)
      .replace(/href="(?!https?:\/\/)([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+[^"]*)"/g, 'href="https://$1"')
      // Handle root-relative URLs (/about)
      .replace(/href="\/([^"]*)"/g, 'href="https://lapsnaps.com/$1"')
      // Handle relative URLs without leading slash (about, contact, etc.)
      .replace(/href="(?!https?:\/\/|\/)([^"#?]*)"/g, 'href="https://lapsnaps.com/$1"')
      // Add target and rel to all links that don't have them
      .replace(/<a(?![^>]*target=)([^>]*)>/g, '<a$1 target="_blank" rel="noopener noreferrer">')
  );
};

export default function BlogPostServer({ post }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const readTime = calculateReadingTime(post.content);

  // console.log('Original content links:', post.content?.match(/<a[^>]*href="[^"]*"[^>]*>/g));

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
          alt={`${post.category} – track-day photography article hero image`}
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
          <MuiLink underline="hover" color="inherit" href="/blogs" sx={{ cursor: 'pointer' }}>
            Blog
          </MuiLink>
          <Typography color="text.primary">{post.title}</Typography>
        </Breadcrumbs>

        {/* Article Header */}
        <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, boxShadow: 2, mb: 4 }}>
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

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
              fontWeight: 800,
              mb: 3,
              lineHeight: 1.2,
              color: 'text.primary'
            }}
          >
            {post.title}
          </Typography>

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
              <Avatar
                src={
                  post.authorAvatar?.url ||
                  `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.21/icons/person-circle.svg`
                }
                alt={post.author?.toUpperCase() || 'Author'}
                sx={{ width: 40, height: 40 }}
              />
              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: { xs: '15px', md: '15px' }, color: 'text.primary' }}>
                {post.author}
              </Typography>
            </Box>

            {post.publishedDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{formatDate(post.publishedDate)}</Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{readTime?.display}</Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />
        </Box>

        {/* Article Content */}
        <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, boxShadow: 2 }}>
          <Box
            dangerouslySetInnerHTML={{ __html: processHtmlLinks(post.content) }}
            sx={{
              '& *': { maxWidth: '100%' },
              '& h1': {
                fontSize: { xs: '1.8rem', md: '2.2rem' },
                fontWeight: 800,
                mt: 4,
                mb: 3,
                lineHeight: 1.2,
                color: 'text.primary'
              },
              '& h2': {
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 700,
                mt: 4,
                mb: 2,
                lineHeight: 1.3,
                color: 'text.primary'
              },
              '& h3': {
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 600,
                mt: 3,
                mb: 1.5,
                lineHeight: 1.3,
                color: 'text.primary'
              },
              '& h4, & h5, & h6': {
                color: 'text.primary'
              },
              '& p': {
                fontSize: '1.05rem',
                lineHeight: 1.8,
                mb: 2.5,
                color: 'text.primary'
              },
              '& li': {
                color: 'text.primary'
              },
              '& blockquote': {
                color: 'text.secondary',
                borderLeftColor: 'divider'
              },
              '& code': {
                color: 'text.primary'
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 1,
                my: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              },
              '& a': {
                textDecoration: 'underline',
                fontWeight: 600,
                color: 'text.primary',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
