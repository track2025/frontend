import React from 'react';
// components
import SingleSlideCarousel from 'src/components/carousels/singleSlide';
import MegaMenu from 'src/components/mega-menu/MegaMenuDesktopVertical';
// slides data
import { data } from './data';
import { Stack } from '@mui/material';

export default function Hero({ data: shops }) {
  return (
    <Stack direction="row" gap={2} mt={2}>
      <MegaMenu data={shops} />
      <SingleSlideCarousel data={data} />
    </Stack>
  );
}
