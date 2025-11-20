import React from 'react';

// mui
import { Typography, Grid, Box, Stack, Container } from '@mui/material';

// components
import ShopCard from 'src/components/cards/shop';

// api
import * as api from 'src/services';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Professional Motorsport Photographers | Lap Snaps',
  description:
    'Browse talented motorsport photographers who capture stunning vehicle and racing moments. Find professional track day photographers and racing event photography services.',
  keywords:
    'motorsport photographers, race track photographers, vehicle photography, track day photography, racing event photographers, professional car photography',
  openGraph: {
    title: 'Professional Motorsport Photographers | Lap Snaps',
    description: 'Browse talented motorsport photographers who capture stunning vehicle and racing moments',
    url: 'https://lapsnaps.com/photographers',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Motorsport Photographers | Lap Snaps',
    description: 'Browse talented motorsport photographers who capture stunning vehicle and racing moments'
  },
  alternates: {
    canonical: 'https://lapsnaps.com/photographers'
  }
};

export default async function ShopComponent() {
  const data = await api.getShops();
  // console.log('Photographers data:', data.data);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Professional Motorsport Photographers',
    description: 'Browse talented motorsport photographers who capture stunning vehicle and racing moments',
    url: 'https://lapsnaps.com/photographers',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: data?.data?.map((photographer, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Person',
          '@id': `https://lapsnaps.com/photographers/${photographer.slug}`,
          name: photographer.title || photographer.name || 'LapSnaps Professional Photographer',
          description:
            photographer.description ||
            `Professional motorsport photographer specializing in race track and vehicle photography with ${photographer.productCount || 0} photos and ${photographer.followers?.length || 0} followers`,
          image: photographer.logo?.url || photographer.cover?.url,
          jobTitle: 'Motorsport Photographer',
          knowsAbout: [
            'Motorsport Photography',
            'Race Track Photography',
            'Vehicle Photography',
            'Track Day Photography'
          ],
          url: `https://lapsnaps.com/photographers/${photographer.slug}`,
          // Add custom properties for photo count and followers
          additionalProperty: [
            {
              '@type': 'PropertyValue',
              name: 'photoCount',
              value: photographer.productCount || 0
            },
            {
              '@type': 'PropertyValue',
              name: 'followerCount',
              value: photographer.followers?.length || 0
            }
          ]
        }
      }))
    }
  };

  // Enhanced schema for photographers with detailed information
  const photographerStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Motorsport Photographers Directory',
    description: 'Directory of professional motorsport photographers with photo counts and follower information',
    numberOfItems: data?.data?.length || 0,
    itemListElement: data?.data?.map((photographer, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Photographer',
        name: photographer.title || photographer.name || 'LapSnaps Professional Photographer',
        description: `Professional motorsport photographer with ${photographer.productCount || 0} track photos and ${photographer.followers?.length || 0} followers`,
        image: photographer.logo?.url || photographer.cover?.url,
        url: `https://lapsnaps.com/photographers/${photographer.slug}`,
        photographer: {
          '@type': 'Person',
          name: photographer.title || photographer.name || 'LapSnaps Professional Photographer'
        },
        // Custom metrics
        photoCount: photographer.productCount || 0,
        followerCount: photographer.followers?.length || 0,
        specialty: ['Motorsport Photography', 'Race Track Photography', 'Vehicle Photography']
      }
    }))
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
        name: 'Photographers',
        item: 'https://lapsnaps.com/photographers'
      }
    ]
  };

  // Summary schema for the entire photographers page
  const pageSummarySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Professional Motorsport Photographers',
    description: `Browse ${data?.data?.length || 0} professional motorsport photographers with a total of ${data?.data?.reduce((total, photographer) => total + (photographer.productCount || 0), 0)} photos and ${data?.data?.reduce((total, photographer) => total + (photographer.followers?.length || 0), 0)} total followers`,
    url: 'https://lapsnaps.com/photographers',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: data?.data?.length || 0,
      itemListElement: data?.data?.map((photographer, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Person',
          name: photographer.title,
          description: `Photographer with ${photographer.productCount || 0} photos and ${photographer.followers?.length || 0} followers`,
          url: `https://lapsnaps.com/photographers/${photographer.slug}`
        }
      }))
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(photographerStructuredData) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSummarySchema) }} />

      <Container maxWidth="xl">
        <Stack
          direction={'column'}
          sx={{
            gap: 3,
            mt: 5
          }}
        >
          <Box>
            <Typography
              variant="h1"
              color="text.primary"
              textAlign="center"
              sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}
            >
              Professional Motorsport Photographers
            </Typography>
            <Typography
              variant="h2"
              color="text.secondary"
              textAlign="center"
              sx={{
                fontSize: { xs: '0.8rem', md: '1.2rem' },
                fontWeight: 'normal',
                lineHeight: 1.6
              }}
            >
              Talented photographers who capture stunning car and racing moments for you
            </Typography>

            {/* Optional: Display summary stats */}
            {/* <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1, fontSize: '0.9rem' }}>
              {data?.data?.length || 0} photographers •{' '}
              {data?.data?.reduce((total, photographer) => total + (photographer.productCount || 0), 0)} total photos •{' '}
              {data?.data?.reduce((total, photographer) => total + (photographer.followers?.length || 0), 0)} total
              followers
            </Typography> */}
          </Box>
          <Box>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              {(data?.data).map((inner) => (
                <React.Fragment key={Math.random()}>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <ShopCard shop={inner} isLoading={false} />
                  </Grid>
                </React.Fragment>
              ))}
              {!Boolean(data?.data.length) && (
                <Typography variant="h3" color="error.main" textAlign="center">
                  No photographers registered yet
                </Typography>
              )}
            </Grid>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
