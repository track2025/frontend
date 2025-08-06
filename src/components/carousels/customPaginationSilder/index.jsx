'use client';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import Image from 'next/image';
import RootStyled from './styled';

ProductImage.propTypes = {
  item: PropTypes.object.isRequired
};

function ProductImage({ item }) {
  return (
    <div style={{ backgroundColor:'red'}}>
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
    </div>
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