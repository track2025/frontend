import { Box, Card, CardContent, Grid, Stack, Typography, Skeleton } from '@mui/material';
import React from 'react';
// icons

import { fCurrency } from 'src/utils/formatNumber';

export default function ShopDetail({ data, isLoading }) {
  return (
    <Grid container spacing={3}>
      {data.map((v, i) => (
        <Grid key={i} item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack>
                  <Typography variant="h4">
                    {isLoading ? (
                      <Skeleton variant="text" width={80} />
                    ) : v.name === 'Total Income' || v.name === 'Total Commission' ? (
                      fCurrency(v.items)
                    ) : (
                      v.items
                    )}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {isLoading ? <Skeleton variant="text" width={120} /> : v.name}
                  </Typography>
                </Stack>
                {isLoading ? (
                  <Skeleton variant="circular" width={56} height={56} />
                ) : (
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
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
