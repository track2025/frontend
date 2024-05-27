'use client';
// react
import React from 'react';
// mui
import { alpha } from '@mui/material/styles';
import { Typography, Box, Container, Stack } from '@mui/material';

// icons
import { MdOutlineSupportAgent } from 'react-icons/md';
import { MdLoop } from 'react-icons/md';
import { BiDollar } from 'react-icons/bi';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { VscFeedback } from 'react-icons/vsc';
import { MdSettingsBackupRestore } from 'react-icons/md';
import { RiExchangeDollarLine } from 'react-icons/ri';

export default function WhyUs() {
  const data = [
    {
      title: 'Free Shipping',
      icon: <AiOutlineShoppingCart size={40} />,
      description: ' When you spend $100+'
    },
    {
      title: 'Feedbacks',
      icon: <VscFeedback size={40} />,
      description: '100% Customer'
    },
    {
      title: 'Free Return',
      icon: <MdSettingsBackupRestore size={40} />,
      description: '30 Day Returns Policy'
    },
    {
      title: 'Secure System',
      icon: <RiExchangeDollarLine size={40} />,
      description: '100% Secure Gaurantee'
    },
    {
      title: 'Online Supports',
      icon: <MdOutlineSupportAgent size={40} />,
      description: '24/7 Dedicated Support.'
    }
  ];
  return (
    <Box
      sx={{
        py: 4,
        bgcolor: (theme) => alpha(theme.palette.grey[600], 0.2),
        display: {
          md: 'block',
          xs: 'none'
        },
        borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
      }}
    >
      <Container fixed>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={4}>
          {data.map((v) => (
            <Stack
              key={Math.random()}
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{
                svg: {
                  color: 'primary.main'
                }
              }}
            >
              {v.icon}
              <Stack>
                <Typography variant="h5" color="text.primary">
                  {v.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {v.description}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
