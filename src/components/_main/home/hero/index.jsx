import React, { Suspense } from 'react';
// components
import SingleSlideCarousel from 'src/components/carousels/singleSlide';
import MegaMenu from 'src/components/mega-menu/MegaMenuDesktopVertical';
// slides data
import { data } from './data';
import { Stack } from '@mui/material';

export default function Hero() {
  return (
    <Stack direction="row" gap={2} sx={{ px: 3 }} mt={2}>
      <Suspense loading="Loading....">
        <MegaMenu />
      </Suspense>
      <Suspense loading="Loading....">
        <SingleSlideCarousel data={data} />
      </Suspense>
    </Stack>
  );
}
