// 'use client';
// import React from 'react';
// import { useRouter } from 'next-nprogress-bar';

// // mui
// import { Box, Button, Typography } from '@mui/material';

// // svg
// import { NotFoundIllustration } from 'src/illustrations';

// export default function NotFound() {
//   const router = useRouter();
//   return (
//     <Box
//       spacing={3}
//       sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 3 }}
//     >
//       <NotFoundIllustration />
//       <Typography variant="h4" color="text.primary">
//         404, Page not founds
//       </Typography>
//       <Typography variant="body1" color="initial">
//         Something went wrong. It’s look that your requested could not be found. It’s look like the link is broken or the
//         page is removed.
//       </Typography>
//       <Box sx={{ display: 'flex', gap: 2 }}>
//         <Button variant="contained" color="primary" size="large" onClick={() => router.back()}>
//           Go Back
//         </Button>
//         <Button variant="outlined" color="primary" onClick={() => router.push('/')} size="large">
//           Go To Home
//         </Button>
//       </Box>
//     </Box>
//   );
// }

import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import { NotFoundIllustration } from 'src/illustrations';

export const metadata = {
  title: '404 - Page Not Found | Lap Snaps',
  description: 'The page you are looking for could not be found.',
  robots: 'noindex, nofollow, noarchive'
};

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 3,
        minHeight: '60vh',
        textAlign: 'center',
        p: 3
      }}
    >
      <NotFoundIllustration />

      {/* H1 for accessibility */}
      <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 'bold' }}>
        404 - Page Not Found
      </Typography>

      <Typography variant="body1" sx={{ maxWidth: '500px', lineHeight: 1.6 }}>
        We're sorry, but the page you're looking for doesn't exist. It may have been moved, deleted, or you may have
        entered the wrong URL.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="contained" color="primary" size="large" component={Link} href="/">
          Go to Homepage
        </Button>
        <Button variant="outlined" color="primary" size="large" component={Link} href="/blogs">
          Visit Our Blog
        </Button>
      </Box>
    </Box>
  );
}
