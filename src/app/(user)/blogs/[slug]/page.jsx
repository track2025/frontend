import { notFound } from 'next/navigation';
import { getBlogBySlug } from 'src/services/blogs';
import BlogPostClient from 'src/components/_main/blog/BlogPostClient';
import BlogPostServer from 'src/components/_main/blog/BlogPostServer';

// Helper function to clean HTML for schema
const cleanHtmlForSchema = (html) => {
  if (!html) return '';
  // Remove HTML tags but keep the text content
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    const response = await getBlogBySlug(slug);

    if (!response.success || !response.data) {
      return {
        title: 'Blog Post Not Found | LapSnaps',
        description: 'The requested blog post could not be found.'
      };
    }

    const post = response.data;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.metaDescription || post.excerpt,
      image: post.heroImage?.url || post.featuredImage?.url,
      datePublished: post.publishedDate || post.createdAt, // Fallback to createdAt
      dateModified: post.updatedAt || post.publishedDate || post.createdAt,
      author: {
        '@type': 'Person',
        name: post.author || 'LapSnaps Team' // Fallback author
      },
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
      },
      url: `https://lapsnaps.com/blogs/${post.slug}`, // Required field
      articleBody: cleanHtmlForSchema(post.content) // CRITICAL: Added articleBody
    };

    return {
      title: `${post.metaTitle || post.title} | LapSnaps Blog`,
      description: post.metaDescription || post.excerpt,
      keywords: `${post.category}, motorsport blog, ${post.title}, track day tips, racing photography`,
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        images: [post.heroImage?.url || post.featuredImage?.url],
        type: 'article',
        publishedTime: post.publishedDate || post.createdAt,
        authors: [post.author || 'LapSnaps Team'],
        url: `https://lapsnaps.com/blogs/${post.slug}`
      },
      twitter: {
        card: 'summary_large_image',
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        images: [post.heroImage?.url || post.featuredImage?.url]
      },
      alternates: {
        canonical: `https://lapsnaps.com/blogs/${post.slug}`
      },
      other: {
        structuredData: JSON.stringify(structuredData)
      }
    };
  } catch (error) {
    return {
      title: 'Blog Post | LapSnaps',
      description: 'Expert tips and insights for motorsport photographers and track day enthusiasts.'
    };
  }
}

// Main page component - using loading.js for skeleton instead
export default async function BlogPostPage({ params }) {
  const { slug } = params;

  try {
    const response = await getBlogBySlug(slug);

    if (!response.success || !response.data) {
      notFound();
    }

    const post = response.data;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.metaDescription || post.excerpt,
      image: post.heroImage?.url || post.featuredImage?.url,
      datePublished: post.publishedDate || post.createdAt, // Fallback to createdAt
      dateModified: post.updatedAt || post.publishedDate || post.createdAt,
      author: {
        '@type': 'Person',
        name: post.author || 'LapSnaps Team' // Fallback author
      },
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
      },
      url: `https://lapsnaps.com/blogs/${post.slug}`, // Required field
      articleBody: cleanHtmlForSchema(post.content) // CRITICAL: Added articleBody
    };

    return (
      <>
        <script
          key="blogpost-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <BlogPostServer post={post} />
        <div style={{ display: 'none' }}>
          <BlogPostClient post={response.data} />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }
}
