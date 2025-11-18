// mui
import { Box, Container } from '@mui/material';
import ProductList from 'src/components/_main/products';
import CollectionBanner from 'src/components/_main/banner/CollectionBanner';

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
    ? `${brand} Race Event Photos & Vehicle Gallery | Lap Snaps`
    : 'Motorsport Photography & Race Track Vehicle Photos | Lap Snaps';
  const description = brand
    ? `Explore stunning vehicle and race event photos from ${brand}. High-quality motorsport photography from professional photographers.`
    : 'Browse high-quality vehicle photography from race tracks and motorsport events around the world. Professional track day and racing event photos.';
  const canonical = brand ? `https://lapsnaps.com/products?brand=${brandSlug}` : `https://lapsnaps.com/products`;
  const image = 'https://lapsnaps.com/opengraph-image.png';

  return {
    title,
    description,
    keywords: brand
      ? `${brand} photos, ${brand} racing, motorsport photography, vehicle photos, race track images`
      : 'motorsport photography, race track photos, vehicle photography, track day images, racing event photos',
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

  const brandTitle = brand
    ? brand
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : null;

  // Main structured data for the collection page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: brandTitle ? `${brandTitle} Race Event Photos` : 'Motorsport Photography Collection',
    description: brandTitle
      ? `High-quality vehicle and race event photos from ${brandTitle}`
      : 'Professional motorsport photography from race tracks worldwide',
    url: brand ? `https://lapsnaps.com/products?brand=${brand}` : 'https://lapsnaps.com/products'
  };

  // Generate breadcrumbs data
  const breadcrumbs = [
    { href: '/', name: 'Home' },
    { href: '/products', name: brandTitle ? `${brandTitle} Photos` : 'All Photos' }
  ];

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://lapsnaps.com${item.href}${index === breadcrumbs.length - 1 ? '' : ''}`
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      <Box>
        <Box sx={{ bgcolor: 'background.default' }}>
          <Container maxWidth="xl">
            {/* Pass breadcrumbs to the banner */}
            <CollectionBanner breadcrumbs={breadcrumbs} />
            <ProductList />
          </Container>
        </Box>
      </Box>
    </>
  );
}
