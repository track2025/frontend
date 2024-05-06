import React from 'react';
import { TfiWorld } from 'react-icons/tfi';

import IconButton from '@mui/material/IconButton';

export default function languageSelect() {
  return (
    <IconButton aria-label="lang-curr-select">
      <TfiWorld />
    </IconButton>
  );
}
