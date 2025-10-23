// mui
import { Box, Container } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import ProductList from 'src/components/_main/physical-products';

// ✅ Import Next.js SEO tools
import Head from 'next/head';
import { notFound } from 'next/navigation';

// ✅ Example dynamic SEO generator (if you have brand in URL)
export async function generateMetadata({ searchParams }) {
  const brandSlug = searchParams?.brand || null;

  const toTitleCase = (slug) => {
    if (!slug) return '';
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const brand = toTitleCase(brandSlug);

  const title = brand
    ? ` ${brand.replace(/-/g, ' ')} Events Photos & Vehicle Gallery - Lap Snaps`
    : 'Lap Snaps – High-Quality Vehicle Photography';
  const description = brand
    ? `Explore stunning vehicle and race event photos taken at ${brand.replace(/-/g, ' ')}.`
    : 'Explore Lap Snaps for high-quality vehicle photography from race tracks and car shows around the world.';
  const canonical = brand ? `https://lapsnaps.com/race-track/${brand}/pictures` : `https://lapsnaps.com/products`;
  const image = 'https://lapsnaps.com/default-seo-image.jpg';

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [{ url: image }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  };
}

// ✅ Server Component (renders HTML + SEO)
export default async function Listing({ searchParams }) {
  const brand = searchParams?.brand;

  if (!brand && !Object.keys(searchParams).length) {
    // Optional: handle invalid brand or empty params
    // notFound();
  }

  return (
    <Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container maxWidth="xl">
          <HeaderBreadcrumbs heading="Media" links={[{ name: 'Home', href: '/' }, { name: 'Media' }]} />
          <ProductList />
        </Container>
      </Box>
    </Box>
  );
}
