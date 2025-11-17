import { getBlogs } from 'src/services/blogs';
import BlogsClientPage from 'src/components/_main/blog/BlogsClientPage';
import BlogsServerPage from 'src/components/_main/blog/BlogsServerPage';

export const metadata = {
  title: 'Motorsport Photography Tips, Track-Day News & Tutorials | LapSnaps',
  description:
    'Explore the LapSnaps blog for motorsport photography tips, track day guides, gear reviews, and tutorials. Learn from professional photographers and enthusiasts.',
  keywords:
    'motorsport photography, track day tips, racing photography, camera settings, photography tutorials, motorsport blog',
  openGraph: {
    title: 'Motorsport Photography Tips & Tutorials | LapSnaps',
    description: 'Expert tips, tutorials, and insights for motorsport photographers and track day enthusiasts.',
    url: 'https://lapsnaps.com/blogs',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Motorsport Photography Tips & Tutorials | LapSnaps',
    description: 'Expert tips, tutorials, and insights for motorsport photographers and track day enthusiasts.'
  },
  alternates: {
    canonical: 'https://lapsnaps.com/blogs'
  }
};

export default async function BlogsPage({ searchParams }) {
  const params = await searchParams;
  const page = params?.page ? Number.parseInt(params.page, 10) : 1;
  const search = params?.search || '';

  let blogPosts = [];
  let pagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 8
  };
  let error = null;

  try {
    const response = await getBlogs({
      limit: 8,
      page: page,
      search: search
    });

    if (response.success) {
      blogPosts = response.data || [];
      pagination = {
        currentPage: response.currentPage || page,
        totalPages: response.count || 1,
        totalItems: response.total || 0,
        itemsPerPage: 8
      };
    } else {
      error = 'Failed to load blog posts';
    }
  } catch (err) {
    console.error('Error fetching blogs:', err);
    error = err?.message || 'Unable to load blog posts. Please try again later.';
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'LapSnaps Blog – Motorsport Photography & Track-Day Insights',
    description: 'Expert tips, tutorials, and insights for motorsport photographers and track day enthusiasts',
    url: 'https://lapsnaps.com/blogs',
    publisher: {
      '@type': 'Organization',
      name: 'Lap Snaps',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lapsnaps.com/logo.png'
      }
    },
    blogPost: blogPosts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: post.heroImage?.url || post.featuredImage?.url,
      datePublished: post.publishedDate,
      // url: `https://lapsnaps.com/blogs/${post.slug}`,

      author: {
        '@type': 'Person',
        name: post.author
      },

      datePublished: post.publishedDate || post.createdAt,
      dateModified: post.updatedAt,

      image: post.heroImage?.url || post.featuredImage?.url,

      articleBody: post.content,

      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://lapsnaps.com/blogs/${post.slug}`
      }
    }))
  };

  console.log('Structured Data for Blogs Page:', JSON.stringify(structuredData, null, 2));

  // console.log('blogPosts:', blogPosts);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <BlogsServerPage blogPosts={blogPosts} pagination={pagination} searchTerm={search} />

      <div style={{ display: 'none' }}>
        <BlogsClientPage
          initialBlogPosts={blogPosts}
          initialPagination={pagination}
          initialError={error}
          initialSearch={search}
        />
      </div>
    </>
  );
}
