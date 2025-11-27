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
    type: 'article'
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

  // CollectionPage Schema for listing page
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'LapSnaps Blog – Motorsport Photography & Track-Day Insights',
    description: 'Expert tips, tutorials, and insights for motorsport photographers and track day enthusiasts',
    url: 'https://lapsnaps.com/blogs',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: blogPosts.length,
      itemListElement: blogPosts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Article',
          headline: post.title,
          author: {
            '@type': 'Person',
            name: post.author || 'LapSnaps Team'
          },
          description: post.excerpt || post.description || `Read ${post.title} on LapSnaps blog`,
          datePublished: post.publishedDate || post.createdAt,
          dateModified: post.updatedAt || post.publishedDate || post.createdAt,
          image: post.heroImage?.url || post.featuredImage?.url,
          url: `https://lapsnaps.com/blogs/${post.slug}`,
          publisher: {
            '@type': 'Organization',
            name: 'LapSnaps',
            logo: {
              '@type': 'ImageObject',
              url: 'https://lapsnaps.com/logo.png'
            }
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://lapsnaps.com/blogs/${post.slug}`
          }
        }
      }))
    },
    about: {
      '@type': 'Blog',
      name: 'LapSnaps Blog',
      description: 'Motorsport photography tips, track day guides, and photography tutorials'
    }
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://lapsnaps.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://lapsnaps.com/blogs'
      }
    ]
  };

  // console.log('Structured Data for Blogs Page:', JSON.stringify(collectionPageSchema, null, 2));

  return (
    <>
      {/* CollectionPage Schema */}
      <script
        key="collection-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />

      {/* BreadcrumbList Schema */}
      <script
        key="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

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
