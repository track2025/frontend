import { Box, Card, CardContent, Grid, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
// icons
import { FaGifts } from 'react-icons/fa6';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { TbChartArrowsVertical } from 'react-icons/tb';
import { FaWallet } from 'react-icons/fa6';

export default function ShopDetail({ data }) {
  const theme = useTheme();
  const dataMain = [
    {
      name: 'Total Earning',
      items: data?.totalEarningsAfterCommission,
      color: theme.palette.error.main,
      icon: <FaWallet size={30} />
    },
    {
      name: 'Admin Commission Rate',
      items: data?.totalCommission,
      color: theme.palette.success.main,
      icon: <TbChartArrowsVertical size={30} />
    },

    {
      name: 'Total Orders',
      items: 3,
      color: theme.palette.secondary.main,
      icon: <HiOutlineClipboardList size={30} />
    },

    {
      name: 'Total Product',
      items: data?.totalProducts,
      color: theme.palette.primary.main,
      icon: <FaGifts size={30} />
    }
  ];

  return (
    <Grid container spacing={3}>
      {dataMain.map((v, i) => (
        <Grid key={i} item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack>
                  <Typography variant="h6">{v.items}</Typography>
                  <Typography variant="subtitle1">{v.name}</Typography>
                </Stack>
                <Box
                  sx={{
                    height: 56,
                    width: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${v.color}`,
                    color: v.color
                  }}
                >
                  {v.icon}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
