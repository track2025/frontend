// import { getTracks } from 'src/services/tracks';
// import TracksClientPage from 'src/components/_main/track/TracksClientPage';
// import TracksServerPage from 'src/components/_main/track/TracksServerPage';

// export const metadata = {
//   title: 'Car, Bike & Kart Race Tracks Worldwide | LapSnaps',
//   description:
//     'Explore car, bike & kart circuits from around the world. Browse iconic race tracks including Silverstone, Spa-Francorchamps, Nürburgring, Bedford Autodrome, Yas Marina, and more. Find track days and motorsport events.',
//   keywords:
//     'race tracks, motorsport circuits, car racing, bike racing, kart racing, track days, silverstone, spa francorchamps, nurburgring, yas marina, dubai autodrome, bedford autodrome, brands hatch, racing circuits worldwide',
//   openGraph: {
//     title: 'Car, Bike & Kart Race Tracks Worldwide | LapSnaps',
//     description:
//       'Explore car, bike & kart circuits from around the world. Browse iconic race tracks and find track days.',
//     url: 'https://lapsnaps.com/tracks',
//     type: 'website'
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Car, Bike & Kart Race Tracks Worldwide | LapSnaps',
//     description: 'Explore car, bike & kart circuits from around the world.'
//   },
//   alternates: {
//     canonical: 'https://lapsnaps.com/tracks'
//   }
// };

// // Helper function to extract postal code from address string
// const extractPostalCode = (address) => {
//   if (!address) return '';

//   // Common postal code patterns
//   const patterns = [
//     /[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}/, // UK format: AB1 2CD, W1A 1AA
//     /\d{5}(-\d{4})?/, // US format: 12345 or 12345-6789
//     /[A-Z]\d[A-Z]\s*\d[A-Z]\d/, // Canadian format: A1A 1A1
//     /\d{4}/ // Basic 4-digit codes (Australia, etc.)
//   ];

//   for (const pattern of patterns) {
//     const match = address.match(pattern);
//     if (match) {
//       return match[0].trim();
//     }
//   }

//   return '';
// };

// // Helper function to build address object safely (same as track details page)
// const buildAddressObject = (track) => {
//   const address = {};

//   // Use track.address as streetAddress if available
//   if (track.address?.trim()) {
//     address.streetAddress = track.address.trim();
//   }

//   if (track.city?.trim()) {
//     address.addressLocality = track.city.trim();
//   }

//   if (track.region?.trim()) {
//     address.addressRegion = track.region.trim();
//   }

//   // Prioritize dedicated postalCode field, fall back to extracting from address
//   if (track.postalCode?.trim()) {
//     address.postalCode = track.postalCode.trim();
//   } else if (track.address?.trim()) {
//     const extractedPostalCode = extractPostalCode(track.address);
//     if (extractedPostalCode) {
//       address.postalCode = extractedPostalCode;
//     }
//   }

//   if (track.country?.trim()) {
//     address.addressCountry = track.country.trim();
//   }

//   // Only return address object if it has at least one property
//   return Object.keys(address).length > 0 ? address : null;
// };

// export default async function TracksPage({ searchParams }) {
//   const params = await searchParams;
//   const page = params?.page ? Number.parseInt(params.page, 10) : 1;
//   const search = params?.search || '';

//   let tracks = [];
//   let pagination = {
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//     itemsPerPage: 100
//   };
//   let error = null;

//   try {
//     const response = await getTracks({
//       limit: 100,
//       page: page,
//       search: search
//     });

//     if (response.success) {
//       tracks = response.data || [];
//       pagination = {
//         currentPage: response.currentPage || page,
//         totalPages: response.count || 1,
//         totalItems: response.total || 0,
//         itemsPerPage: 100
//       };
//     } else {
//       error = 'Failed to load tracks';
//     }
//   } catch (err) {
//     console.error('Error fetching tracks:', err);
//     error = 'Unable to load tracks. Please try again later.';
//   }

//   const structuredData = {
//     '@context': 'https://schema.org',
//     '@type': 'CollectionPage',
//     name: 'Car, Bike & Kart Race Tracks Worldwide',
//     description:
//       'Explore car, bike & kart circuits from around the world. Browse iconic race tracks including Silverstone, Spa-Francorchamps, Nürburgring and more.',
//     url: 'https://lapsnaps.com/tracks',

//     mainEntity: {
//       '@type': 'ItemList',
//       itemListElement: tracks.map((track, index) => {
//         // Build address object safely using the helper function
//         const addressObject = buildAddressObject(track);

//         // Build the base item without address first
//         const baseItem = {
//           '@type': 'ListItem',
//           position: index + 1,
//           item: {
//             '@type': 'SportsActivityLocation',
//             '@id': `https://lapsnaps.com/tracks/${track.slug || track._id}`,
//             name: track.name || 'Unknown Track',
//             description:
//               track.description || `Professional motorsport photography from ${track.name || 'this race track'}`,
//             image: track.logo?.url || track.bannerImage?.url || track.thumbnailImage?.url || undefined,
//             url: `https://lapsnaps.com/tracks/${track.slug || track._id}`,
//             // Additional optional properties
//             ...(track.phone && { telephone: track.phone }),
//             ...(track.email && { email: track.email }),
//             ...(track.website && { sameAs: track.website })
//           }
//         };

//         // Only add address if we have address data
//         if (addressObject) {
//           baseItem.item.address = {
//             '@type': 'PostalAddress',
//             ...addressObject
//           };
//         }

//         return baseItem;
//       })
//     }
//   };

//   // console.log('Structured Data for Tracks Page:', JSON.stringify(structuredData, null, 2));

//   const breadcrumbSchema = {
//     '@context': 'https://schema.org',
//     '@type': 'BreadcrumbList',
//     itemListElement: [
//       {
//         '@type': 'ListItem',
//         position: 1,
//         name: 'Home',
//         item: 'https://lapsnaps.com'
//       },
//       {
//         '@type': 'ListItem',
//         position: 2,
//         name: 'Tracks',
//         item: 'https://lapsnaps.com/tracks'
//       }
//     ]
//   };

//   return (
//     <>
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

//       <TracksServerPage tracks={tracks} pagination={pagination} searchTerm={search} />

//       {/* <div style={{ display: 'none' }}>
//         <TracksClientPage
//           initialTracks={tracks}
//           initialPagination={pagination}
//           initialError={error}
//           initialSearch={search}
//         />
//       </div> */}
//     </>
//   );
// }

import { Suspense } from 'react'
import { getTracks } from 'src/services/tracks'
import TracksServerPage from 'src/components/_main/track/TracksServerPage'
import { CircularProgress, Box } from '@mui/material'

export const metadata = {
  title: 'Car, Bike & Kart Race Tracks Worldwide | LapSnaps',
  description:
    'Explore car, bike & kart circuits from around the world. Browse iconic race tracks including Silverstone, Spa-Francorchamps, Nürburgring, Bedford Autodrome, Yas Marina, and more. Find track days and motorsport events.',
  keywords:
    'race tracks, motorsport circuits, car racing, bike racing, kart racing, track days, silverstone, spa francorchamps, nurburgring, yas marina, dubai autodrome, bedford autodrome, brands hatch, racing circuits worldwide',
  openGraph: {
    title: 'Car, Bike & Kart Race Tracks Worldwide | LapSnaps',
    description:
      'Explore car, bike & kart circuits from around the world. Browse iconic race tracks and find track days.',
    url: 'https://lapsnaps.com/tracks',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Car, Bike & Kart Race Tracks Worldwide | LapSnaps',
    description: 'Explore car, bike & kart circuits from around the world.'
  },
  alternates: {
    canonical: 'https://lapsnaps.com/tracks'
  }
}

// Helper function to extract postal code from address string
const extractPostalCode = (address) => {
  if (!address) return ''

  // Common postal code patterns
  const patterns = [
    /[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}/, // UK format: AB1 2CD, W1A 1AA
    /\d{5}(-\d{4})?/, // US format: 12345 or 12345-6789
    /[A-Z]\d[A-Z]\s*\d[A-Z]\d/, // Canadian format: A1A 1A1
    /\d{4}/ // Basic 4-digit codes (Australia, etc.)
  ]

  for (const pattern of patterns) {
    const match = address.match(pattern)
    if (match) {
      return match[0].trim()
    }
  }

  return ''
}

// Helper function to build address object safely (same as track details page)
const buildAddressObject = (track) => {
  const address = {}

  // Use track.address as streetAddress if available
  if (track.address?.trim()) {
    address.streetAddress = track.address.trim()
  }

  if (track.city?.trim()) {
    address.addressLocality = track.city.trim()
  }

  if (track.region?.trim()) {
    address.addressRegion = track.region.trim()
  }

  // Prioritize dedicated postalCode field, fall back to extracting from address
  if (track.postalCode?.trim()) {
    address.postalCode = track.postalCode.trim()
  } else if (track.address?.trim()) {
    const extractedPostalCode = extractPostalCode(track.address)
    if (extractedPostalCode) {
      address.postalCode = extractedPostalCode
    }
  }

  if (track.country?.trim()) {
    address.addressCountry = track.country.trim()
  }

  // Only return address object if it has at least one property
  return Object.keys(address).length > 0 ? address : null
}

export default async function TracksPage({ searchParams }) {
  const params = await searchParams
  const page = params?.page ? Number.parseInt(params.page, 10) : 1
  const search = params?.search || ''

  let tracks = []
  let pagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 100
  }
  let error = null

  try {
    const response = await getTracks({
      limit: 100,
      page: page,
      search: search
    })

    if (response.success) {
      tracks = response.data || []
      pagination = {
        currentPage: response.currentPage || page,
        totalPages: response.count || 1,
        totalItems: response.total || 0,
        itemsPerPage: 100
      }
    } else {
      error = 'Failed to load tracks'
    }
  } catch (err) {
    console.error('Error fetching tracks:', err)
    error = 'Unable to load tracks. Please try again later.'
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Car, Bike & Kart Race Tracks Worldwide',
    description:
      'Explore car, bike & kart circuits from around the world. Browse iconic race tracks including Silverstone, Spa-Francorchamps, Nürburgring and more.',
    url: 'https://lapsnaps.com/tracks',

    mainEntity: {
      '@type': 'ItemList',
      itemListElement: tracks.map((track, index) => {
        // Build address object safely using the helper function
        const addressObject = buildAddressObject(track)

        // Build the base item without address first
        const baseItem = {
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'SportsActivityLocation',
            '@id': `https://lapsnaps.com/tracks/${track.slug || track._id}`,
            name: track.name || 'Unknown Track',
            description:
              track.description || `Professional motorsport photography from ${track.name || 'this race track'}`,
            image: track.logo?.url || track.bannerImage?.url || track.thumbnailImage?.url || undefined,
            url: `https://lapsnaps.com/tracks/${track.slug || track._id}`,
            // Additional optional properties
            ...(track.phone && { telephone: track.phone }),
            ...(track.email && { email: track.email }),
            ...(track.website && { sameAs: track.website })
          }
        }

        // Only add address if we have address data
        if (addressObject) {
          baseItem.item.address = {
            '@type': 'PostalAddress',
            ...addressObject
          }
        }

        return baseItem
      })
    }
  }

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
        name: 'Tracks',
        item: 'https://lapsnaps.com/tracks'
      }
    ]
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Suspense 
        fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
          </Box>
        }
      >
        <TracksServerPage tracks={tracks} pagination={pagination} searchTerm={search} />
      </Suspense>
    </>
  )
}