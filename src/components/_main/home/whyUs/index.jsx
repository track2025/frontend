'use client';
// react
import React from 'react';
// mui
import { alpha, useTheme } from '@mui/material/styles';
import { Fab, Typography, Card, Grid, Box, IconButton, Stack, Container } from '@mui/material';
import { createGradient } from 'src/theme/palette';

// icons
import { MdOutlineLocalShipping } from 'react-icons/md';
import { MdOutlineSupportAgent } from 'react-icons/md';
import { MdLoop } from 'react-icons/md';
import { BiDollar } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { PiShoppingCart } from 'react-icons/pi';
import { RiExchangeDollarLine } from 'react-icons/ri';
import { MdOutlineSettingsBackupRestore } from 'react-icons/md';
import { VscFeedback } from 'react-icons/vsc';

export default function WhyUs() {
  const theme = useTheme();
  const { themeMode } = useSelector((state) => state.settings);

  const data = [
    {
      title: 'Free Delivery',
      icon: <PiShoppingCart size={28} />,
      description: 'When you spend $100+',
      mainClass: 3
    },
    {
      title: 'Feedbacks',
      icon: <VscFeedback size={28} />,
      description: '100% Customer',
      mainClass: 3
    },
    {
      title: 'Free Return',
      icon: <MdOutlineSettingsBackupRestore size={28} />,
      description: '30 Day Returns Policy',
      mainClass: 3
    },
    {
      title: 'Secure System',
      icon: <RiExchangeDollarLine size={28} />,
      description: '100% Secure Gaurantee',
      mainClass: 3
    },
    {
      title: 'Online Supports',
      icon: <MdOutlineSupportAgent size={28} />,
      description: '24/7 Dedicated Support',
      mainClass: 0
    }
  ];
  return (
    <Box marginTop={{ lg: 12, md: 6 }}>
      <Box
        sx={{
          display: {
            md: 'block',
            xs: 'none'
          },
          bgcolor: themeMode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[300]
        }}
      >
        <Container maxWidth="xl">
          <Stack direction="row" flexWrap="wrap" justifyContent="center">
            {data.map((v) => (
              <Stack direction="row" spacing={2} alignItems="center" marginX={3} pt={{ lg: 3, md: v.mainClass }} pb={3}>
                <IconButton
                  sx={{
                    svg: {
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  {v.icon}
                </IconButton>
                <Box>
                  <Typography variant="h5" color="common.primary">
                    {v.title}
                  </Typography>
                  <Typography variant="body1" color="common.secondary" fontSize={{ xl: 16, md: 14 }}>
                    {v.description}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
