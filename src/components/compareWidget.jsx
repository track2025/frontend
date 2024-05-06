import React from 'react';
import { GoGitCompare } from 'react-icons/go';
import { IconButton, Badge } from '@mui/material';
import { useSelector } from 'react-redux';

export default function wishlistWidget() {
  const { products: compareProducts } = useSelector(({ compare }) => compare);
  return (
    <IconButton aria-label="compare">
      <Badge badgeContent={compareProducts?.length} color="secondary" showZero>
        <GoGitCompare />
      </Badge>
    </IconButton>
  );
}
