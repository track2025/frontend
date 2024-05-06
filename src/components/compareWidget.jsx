import React from 'react';
import { GoGitCompare } from 'react-icons/go';
import IconButton from '@mui/material/IconButton';

export default function wishlistWidget() {
  return (
    <IconButton aria-label="compare">
      <GoGitCompare />
    </IconButton>
  );
}
