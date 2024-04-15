import { Box, Card, CardContent, Grid, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
// icons
import { FaGifts } from 'react-icons/fa6';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { TbChartArrowsVertical } from 'react-icons/tb';
import { FaSackDollar } from 'react-icons/fa6';
import { FaWallet } from 'react-icons/fa6';
import { FaRegAddressBook } from 'react-icons/fa';

export default function ShopDetail() {
  const theme = useTheme();
  const data = [
    {
      name: 'Registered Since',
      items: 'October 2, 2023',
      color: theme.palette.info.main,
      icon: <FaRegAddressBook size={30} />
    },
    {
      name: 'Total Product',
      items: 26,
      color: theme.palette.primary.main,
      icon: <FaGifts size={30} />
    },
    {
      name: 'Total Orders',
      items: 3,
      color: theme.palette.secondary.main,
      icon: <HiOutlineClipboardList size={30} />
    },
    {
      name: 'Admin Commission Rate',
      items: '0%',
      color: theme.palette.success.main,
      icon: <TbChartArrowsVertical size={30} />
    },
    {
      name: 'Gross Sales',
      items: 26,
      color: theme.palette.warning.main,
      icon: <FaSackDollar size={30} />
    },
    {
      name: 'Current Balance',
      items: 26,
      color: theme.palette.error.main,
      icon: <FaWallet size={30} />
    }
  ];

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          {data.map((v, i) => (
            <Grid key={i} item xs={12} sm={6} md={4}>
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
      </CardContent>
    </Card>
  );
}
