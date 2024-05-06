import React from 'react';
import { GoGitCompare } from 'react-icons/go';
import { IconButton, Badge } from '@mui/material';

export default function wishlistWidget() {
  return (
    <IconButton aria-label="compare">
      <Badge badgeContent={0} color="secondary" showZero>
        <GoGitCompare />
      </Badge>
    </IconButton>
  );
}
