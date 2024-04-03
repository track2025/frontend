import React from 'react';
// components
import SingleSlideCarousel from 'src/components/carousels/singleSlide';

// slides data
import { data } from './data';

export default function Hero() {
  return <SingleSlideCarousel data={data} />;
}
