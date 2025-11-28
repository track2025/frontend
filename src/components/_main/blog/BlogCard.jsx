'use client';
import Link from 'next/link';
import { Card, CardActionArea, CardMedia, CardContent, Chip, Typography, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { calculateReadingTime } from 'src/utils/readingTime';

export const BlogCard = ({ post, onClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  // const calculateReadTime = () => {
  //   if (post.readTime) return post.readTime;
  //   if (post.content) return `${Math.ceil(post.content.length / 1000)} min read`;
  //   return '2 min read';
  // };
  const readTime = calculateReadingTime(post.content);

  // If onClick is provided, use the existing logic
  if (onClick) {
    return (
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
        <CardActionArea
          onClick={() => onClick(post.slug)}
          sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          {/* Featured Image Container */}
          <Box
            sx={{
              width: '100%',
              height: 220,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <CardMedia
              component="img"
              image={post.featuredImage?.url || '/images/blog-placeholder.jpg'}
              alt={post.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
          </Box>

          <CardContent
            sx={{
              p: 3,
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              width: '100%'
            }}
          >
            {/* Category Chip */}
            {post.category && (
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
            )}

            {/* Post Title - H3 */}
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem' },
                fontWeight: 700,
                // color: '#1a1a1a',
                mb: 2,
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {' '}
              {post.title}
              {/* TODO */}
            </Typography>

            {/* Excerpt */}
            <Typography
              variant="body2"
              sx={{
                // color: '#666',
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
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {post.author}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{}}>
                  {readTime.display}
                </Typography>
              </Box>
            </Box>

            {/* Published Date */}
            {post.publishedDate && (
              <Typography variant="caption" sx={{ mt: 1 }}>
                {formatDate(post.publishedDate)}
              </Typography>
            )}

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
    );
  }

  // Use Link for better performance when no custom onClick
  return (
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
      <CardActionArea
        component={Link}
        href={`/blogs/${post.slug}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {/* Featured Image Container */}
        <Box
          sx={{
            width: '100%',
            height: 220,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <CardMedia
            component="img"
            image={post.featuredImage?.url || '/images/blog-placeholder.jpg'}
            alt={post.title || 'Blog post image'}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
        </Box>

        <CardContent
          sx={{
            p: 3,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {/* Category Chip */}
          {post.category && (
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
          )}

          {/* Post Title - H3 */}
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem' },
              fontWeight: 700,
              // color: '#1a1a1a',
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
              // color: '#666',
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
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {post.author}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption" sx={{}}>
                {readTime.display}
              </Typography>
            </Box>
          </Box>

          {/* Published Date */}
          {post.publishedDate && (
            <Typography variant="caption" sx={{ mt: 1 }}>
              {formatDate(post.publishedDate)}
            </Typography>
          )}

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
  );
};
