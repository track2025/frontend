'use client';
// react
import React from 'react';
// mui
import { Typography, Card, Stack, Divider } from '@mui/material';

// icons
import { MdOutlineSupportAgent } from 'react-icons/md';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { AiOutlineCamera } from 'react-icons/ai';
import { VscFeedback } from 'react-icons/vsc';
import { MdSettingsBackupRestore } from 'react-icons/md';
import { RiExchangeDollarLine } from 'react-icons/ri';

export default function WhyUs() {
  const data = [
  {
    title: 'Capture the Moment',
    icon: <AiOutlineCamera size={40} />,
    description: 'Stunning high-res photos and videos of your race — just like pros get.'
  },
  {
    title: 'Loved by Drivers',
    icon: <VscFeedback size={40} />,
    description: 'Hundreds of racers trust us to relive their best laps.'
  },
  {
    title: 'Fast & Secure',
    icon: <RiExchangeDollarLine size={40} />,
    description: 'Instant delivery, secure payments, no worries.'
  },
  {
    title: 'Always Here',
    icon: <MdOutlineSupportAgent size={40} />,
    description: 'Trackside or online — we’ve got your back 24/7.'
  }
];
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: '12px',

        display: {
          md: 'block',
          xs: 'none'
        }
        // borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={1}>
        {data.map((v, i) => (
          <React.Fragment key={Math.random()}>
            <Stack
              direction="row"
              alignItems="center"
              // justifyContent="center"
              spacing={1}
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
            {i !== 3 ? <Divider orientation="vertical" flexItem /> : null}
          </React.Fragment>
        ))}
      </Stack>
    </Card>
  );
}
