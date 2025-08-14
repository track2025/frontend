'use client';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import Image from 'next/image';
import RootStyled from './styled';

// Helper function to detect video URL
function isVideo(url) {
  return /\.(mp4|webm|ogg|mov)$/i.test(url);
}

ProductImage.propTypes = {
  item: PropTypes.object.isRequired
};

function ProductImage({ item }) {
  if (isVideo(item?.url)) {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: 'black'
        }}
      >
        <video
          src={item.url}
          controls={true}
          autoPlay={true}
          muted
          loop
          playsInline
          preload="metadata"
          //poster={item?.blurDataURL || ''}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'top center',
            display: 'block'
          }}
        />
      </Box>
    );
  }

  // If not a video, render Next Image as before
  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image
        priority
        fill
        src={item?.url}
        alt="product-image"
        style={{
          objectFit: 'contain',
          objectPosition: 'top center'
        }}
        placeholder={item?.blurDataURL ? 'blur' : 'empty'}
        blurDataURL={item?.blurDataURL}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </Box>
  );
}

export default function ProductImageDisplay({ product }) {
  const mainImage = product?.images?.[0] || {};

  return (
    <RootStyled>
      <div className="carousel-wrap">
        <ProductImage item={mainImage} />
      </div>
    </RootStyled>
  );
}

ProductImageDisplay.propTypes = {
  product: PropTypes.object
};
