import { notFound } from 'next/navigation';
import { getBlogBySlug } from 'src/services/blogs';
import BlogPostClient from 'src/components/_main/blog/BlogPostClient';

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

    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      keywords: `${post.category}, motorsport blog, ${post.title}, track day tips`,
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        images: [post.heroImage?.url || post.featuredImage?.url],
        type: 'article',
        publishedTime: post.publishedDate,
        authors: [post.author]
      },
      twitter: {
        card: 'summary_large_image',
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        images: [post.heroImage?.url || post.featuredImage?.url]
      },
      alternates: {
        canonical: `https://lapsnaps.com/blogs/${post.slug}`
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

    return <BlogPostClient post={response.data} />;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }
}
