// mui
import { Container, Typography } from '@mui/material';

// component import
import AboutUs from 'src/components/_main/about';

// Next.js dynamic import
import dynamic from 'next/dynamic';

// skeleton component import
import HeaderBreadcrumbsSkeleton from 'src/components/skeletons/breadcrumbs';
import AboutBanner from 'src/components/_main/banner/AboutBanner';

// Dynamically importing the HeaderBreadcrumbs component with a fallback to a skeleton loader while loading
const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <HeaderBreadcrumbsSkeleton />
});

export const metadata = {
  title: 'About Us | Lap Snaps - Professional Motorsport Photography',
  description:
    'Learn about Lap Snaps, your trusted source for high-quality motorsport photography from race tracks and events worldwide.',
  keywords: 'about lap snaps, motorsport photography, race track photography, about us, professional photography',
  openGraph: {
    title: 'About Us | Lap Snaps - Professional Motorsport Photography',
    description: 'Learn about Lap Snaps and our mission to deliver professional motorsport photography.',
    url: 'https://lapsnaps.com/about',
    type: 'website',
    images: [
      {
        url: 'https://lapsnaps.com/images/about-us-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Lap Snaps - About Us'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Lap Snaps - Professional Motorsport Photography',
    description: 'Learn about Lap Snaps and our mission to deliver professional motorsport photography.',
    images: ['https://lapsnaps.com/images/about-us-banner.jpg']
  },
  alternates: {
    canonical: 'https://lapsnaps.com/about'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default function Page() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://lapsnaps.com/#organization',
    name: 'Lap Snaps',
    alternateName: 'LapSnaps',
    url: 'https://lapsnaps.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://lapsnaps.com/logo.png',
      width: 250,
      height: 60
    },
    description:
      'Professional motorsport and race track photography marketplace connecting photographers with motorsport enthusiasts worldwide',
    foundingDate: '2020',
    slogan: 'High-Quality Vehicle Photography from Race Tracks Worldwide',
    knowsAbout: [
      'Motorsport Photography',
      'Race Track Photography',
      'Vehicle Photography',
      'Track Day Photography',
      'Racing Event Photography'
    ],
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide'
    },
    sameAs: [
      'https://www.facebook.com/lapsnaps',
      'https://www.instagram.com/lapsnaps',
      'https://twitter.com/lapsnaps',
      'https://www.tiktok.com/@lapsnaps' // Add TikTok if available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@lapsnaps.com',
      availableLanguage: ['English']
    }
  };

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Lap Snaps',
    description:
      'Learn about Lap Snaps, your trusted source for high-quality motorsport photography from race tracks and events worldwide',
    url: 'https://lapsnaps.com/about',
    mainEntity: {
      '@id': 'https://lapsnaps.com/#organization'
    },
    publisher: {
      '@id': 'https://lapsnaps.com/#organization'
    }
  };

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
        name: 'About Us',
        item: 'https://lapsnaps.com/about'
      }
    ]
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Container maxWidth="xl">
       

        <AboutBanner />
        <AboutUs />
      </Container>
    </>
  );
}
