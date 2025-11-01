'use client';

import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Box, Stack, useMediaQuery } from '@mui/material';
import BlurImage from 'src/components/blurImage';
import shape from 'src/theme/shape';

function Slide({ item, isLoading, isMobile, id }) {
  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Image */}
      {item && (
        <BlurImage
          priority
          fill
          objectFit="cover"
          sizes="50%"
          src={item?.url || item?.src}
          alt="hero-carousel"
        />
      )}

      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(0,0,0,0.1)',
        }}
      />
    </Box>
  );
}

Slide.propTypes = {
  item: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
};

export default function ProductDetailsSlider({ product, selectedVariant, isSimple, id }) {
  const isMobile = useMediaQuery('(max-width:600px)');

  const variantList = product?.variants;
  const selected =
    !isSimple && selectedVariant && variantList?.length > 0
      ? variantList.find((v) => v.name?.match(/^[^#]+/)?.[0] === selectedVariant)
      : variantList?.[0];

  const images =
    selected && selected?.images?.length
      ? [...(product?.images || []), ...selected.images]
      : product?.images || [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true });
  const [thumbRef, thumbApi] = useEmblaCarousel({ containScroll: 'keepSnaps', dragFree: true });

  const scrollTo = useCallback(
    (index) => {
      if (!mainApi || !thumbApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbApi]
  );

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    const index = mainApi.selectedScrollSnap();
    setSelectedIndex(index);
    thumbApi.scrollTo(index);
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;
    mainApi.on('select', onSelect);
    onSelect();
  }, [mainApi, onSelect]);

  const isLoading = false;

  return (
    <Stack gap={2}>
      {/* Main Image Slider */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          border: '1px solid #e0e0e0',
          borderRadius: shape.borderRadiusMd,
          aspectRatio: '1 / 1',
        }}
        ref={mainRef}
      >
        <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
          {images.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: '0 0 100%',
                minWidth: 0,
                height: '100%',
                position: 'relative',
              }}
            >
              <Slide item={item} id={id} isLoading={isLoading} isMobile={isMobile} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Thumbnail Slider */}
      <Box ref={thumbRef} sx={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            p: 1,
          }}
        >
          {images.map((item, index) => (
            <Box
              key={index}
              onClick={() => scrollTo(index)}
              sx={{
                flex: '0 0 auto',
                width: 56,
                height: 56,
                mr: 1,
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                outline: selectedIndex === index ? '2px solid #1976d2' : 'none',
                outlineOffset: 2,
              }}
            >
              <BlurImage
                priority
                fill
                objectFit="cover"
                sizes="14vw"
                src={item?.src || item?.url}
                alt={`thumb-${index}`}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Stack>
  );
}

ProductDetailsSlider.propTypes = {
  product: PropTypes.object.isRequired,
  selectedVariant: PropTypes.string,
  isSimple: PropTypes.bool,
  id: PropTypes.string.isRequired,
};
